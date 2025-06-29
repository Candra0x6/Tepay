"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  X,
  CreditCard,
  Download,
  ChevronDown,
  Check,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { iconOptions } from "@/utils/const";
import { AliasEntry } from "@declarations/alias_registry/alias_registry.did";
import useAliasOperations from "@/hooks/use-alias-operation";

type ValidationStatus = "idle" | "checking" | "available" | "taken" | "invalid";

interface PaymentLinkModalProps {
  selectedLink?: AliasEntry | null;
}

export default function PaymentLinkModal({
  selectedLink,
}: PaymentLinkModalProps) {
  const [linkName, setLinkName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(iconOptions[0]);
  const [linkType, setLinkType] = useState<"simple" | "download">("simple");
  const [amountType, setAmountType] = useState<"fixed" | "open">("open");
  const [fixedAmount, setFixedAmount] = useState("");
  const [description, setDescription] = useState("");
  const [creativeFlair, setCreativeFlair] = useState(false);
  const [validationStatus, setValidationStatus] =
    useState<ValidationStatus>("idle");
  const [originalAlias, setOriginalAlias] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { checkAliasAvailability, updateAlias } = useAliasOperations();

  const validateAlias = async (inputAlias: string) => {
    if (!inputAlias.trim()) {
      setValidationStatus("idle");
      return;
    }

    if (inputAlias.length < 3) {
      setValidationStatus("invalid");
      return;
    }

    // Skip validation if the alias hasn't changed from original (for edit mode)
    if (selectedLink && inputAlias === originalAlias) {
      setValidationStatus("available");
      return;
    }

    setValidationStatus("checking");

    try {
      const validate = await checkAliasAvailability(inputAlias);
      if (validate) {
        setValidationStatus("available");
      } else {
        setValidationStatus("taken");
      }
    } catch (error) {
      console.error("Error validating alias:", error);
      setValidationStatus("invalid");
    }
  };

  // Debounced validation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (linkName) {
        validateAlias(linkName);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [linkName]);

  const handleAliasChange = (value: string) => {
    // Only allow alphanumeric characters and hyphens
    const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setLinkName(sanitized);
  };

  const getValidationIcon = () => {
    switch (validationStatus) {
      case "checking":
        return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
      case "available":
        return <Check className="h-5 w-5 text-green-500" />;
      case "taken":
      case "invalid":
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getValidationMessage = () => {
    switch (validationStatus) {
      case "checking":
        return (
          <span className="text-primary font-medium text-sm">
            Checking availability...
          </span>
        );
      case "available":
        return (
          <span className="text-green-600 font-bold text-sm">✓ Available!</span>
        );
      case "taken":
        return (
          <span className="text-red-600 font-bold text-sm">
            ✗ Already taken
          </span>
        );
      case "invalid":
        return (
          <span className="text-red-600 font-bold text-sm">
            ✗ Min 3 characters
          </span>
        );
      default:
        return null;
    }
  };

  // Populate form when selectedLink changes
  useEffect(() => {
    if (selectedLink) {
      setLinkName(selectedLink.alias);
      setOriginalAlias(selectedLink.alias);
      setDescription(selectedLink.description[0] || "");
      setValidationStatus("available"); // Existing alias is valid

      // Find matching icon from iconOptions if icon exists
      if (selectedLink.icon[0]) {
        const matchingIcon = iconOptions.find(
          (option) => option.emoji === selectedLink.icon[0]
        );
        if (matchingIcon) {
          setSelectedIcon(matchingIcon);
        }
      }
    } else {
      // Reset form for new link creation
      setLinkName("");
      setOriginalAlias("");
      setDescription("");
      setSelectedIcon(iconOptions[0]);
      setValidationStatus("idle");
    }
  }, [selectedLink]);

  const canSaveLink = validationStatus === "available" && linkName.length >= 3;

  const previewUrl = `${window.location.host}/send/${linkName || "your-link"}`;

  const handleEditLink = async () => {
    if (!canSaveLink) return;

    setIsSaving(true);
    try {
      // Simulate API call delay
      await updateAlias(
        selectedLink?.alias as string,
        linkName,
        description,
        selectedIcon.emoji
      );

      // Add your actual save/update logic here
    } catch (error) {
      console.error("Error saving payment link:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="bg-transparent border-none shadow-none w-full h-full p-0">
      <div className="space-y-8">
        {/* Link Name & Style */}
        <div className="space-y-4">
          <Label className="text-lg font-black">Link Name & Style</Label>

          <div className="flex items-center gap-4">
            {/* Icon Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-16 h-16 rounded-full border-4 border-black p-0 hover:bg-primary !cursor-pointer",
                    selectedIcon.color
                  )}
                >
                  <span className="text-2xl">{selectedIcon.emoji}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="grid grid-cols-5 gap-1 p-2">
                  {iconOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.emoji}
                      className={cn(
                        "w-12 h-12 rounded-full border-2 border-black p-0 hover:scale-105 transition-transform cursor-pointer flex items-center justify-center",
                        option.color,
                        selectedIcon.emoji === option.emoji &&
                          "ring-4 ring-blue-500 scale-110"
                      )}
                      onClick={() => setSelectedIcon(option)}
                    >
                      <span className="text-lg">{option.emoji}</span>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Link Name Input */}
            <div className="flex-1 relative">
              <Input
                placeholder="Enter link name (e.g., hi)"
                value={linkName}
                onChange={(e) => handleAliasChange(e.target.value)}
                className="border-2 border-black rounded-xl font-bold text-lg h-12 pr-12"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {getValidationIcon()}
              </div>
            </div>
          </div>

          {/* Validation Message */}
          <div className="min-h-[20px] flex items-center ml-20">
            {getValidationMessage()}
          </div>

          {/* URL Preview */}
          <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-4">
            <Label className="text-sm font-bold text-gray-600 mb-2 block">
              Preview URL:
            </Label>
            <p className="font-mono text-blue-600 font-bold break-all">
              {previewUrl}
            </p>
          </div>
        </div>

        {/* Amount Type */}
        <div className="space-y-4">
          <Label className="text-lg font-black">Amount</Label>

          <div className="space-y-3">
            <Card
              className={cn(
                "border-4 rounded-xl p-4 cursor-pointer transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                amountType === "open"
                  ? "border-green-500 bg-green-50"
                  : "border-black bg-white hover:bg-gray-50"
              )}
              onClick={() => setAmountType("open")}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-black rounded-full flex items-center justify-center">
                  {amountType === "open" && (
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-black">Open Amount</h3>
                  <p className="text-sm text-gray-600">
                    Let the payer decide how much to send
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <Label className="text-lg font-black">Description</Label>
          <Textarea
            placeholder="Describe the purpose or details of this payment link..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-2 border-black rounded-xl font-medium min-h-[100px]"
          />
        </div>

        {/* Save Button */}
        <Button
          onClick={handleEditLink}
          disabled={!canSaveLink}
          className="w-full h-16 bg-primary hover:bg-primary/80 disabled:bg-gray-300 disabled:text-gray-500 text-black rounded-xl border-4 border-black font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          {isSaving
            ? "Saving..."
            : selectedLink
            ? "Update Payment Link"
            : "Create Payment Link"}
        </Button>
      </div>
    </Card>
  );
}
