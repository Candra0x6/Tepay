"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Check,
  X,
  User,
  Eye,
  CheckCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Copy,
  ExternalLink,
  Smile,
  MoveRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import useAliasOperations from "@/hooks/use-alias-operation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { iconOptions } from "@/utils/const";
import useTokenOperations from "@/hooks/use-token-canister-calls";
import { useAuth } from "@/hooks/use-auth-client";
import { Principal } from "@dfinity/principal";

interface AliasStepperProps {
  onComplete?: (alias: string) => void;
  onClose?: () => void;
}

type ValidationStatus = "idle" | "checking" | "available" | "taken" | "invalid";

export default function AliasStepper({
  onComplete,
  onClose,
}: AliasStepperProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [alias, setAlias] = useState("");
  const [validationStatus, setValidationStatus] =
    useState<ValidationStatus>("idle");
  const [isCreating, setIsCreating] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(iconOptions[0]);

  const { checkAliasAvailability, registerUserAlias } = useAliasOperations();
  const validateAlias = async (inputAlias: string) => {
    if (!inputAlias.trim()) {
      setValidationStatus("idle");
      return;
    }

    if (inputAlias.length < 3) {
      setValidationStatus("invalid");
      return;
    }

    setValidationStatus("checking");

    // Canister call to check alias availability
    const validate = await checkAliasAvailability(inputAlias);
    // Validate can return a boolean indicating availability
    if (validate) {
      setValidationStatus("available");
    } else {
      setValidationStatus("taken");
    }
  };

  // Debounced validation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (alias) {
        validateAlias(alias);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [alias]);

  const handleAliasChange = (value: string) => {
    // Only allow alphanumeric characters and hyphens
    const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setAlias(sanitized);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirmAlias = async () => {
    setIsCreating(true);

    await registerUserAlias(alias, selectedIcon.emoji, "");
    setIsCreating(false);
    handleNext();
  };

  const handleComplete = () => {
    window.location.href = `/dashboard`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      `https://${window.location.host}/send/${alias}`
    );
  };

  const openLink = () => {
    window.open(`https://${window.location.host}/send/${alias}`, "_blank");
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
          <span className="text-primary font-medium">
            Checking availability...
          </span>
        );
      case "available":
        return (
          <span className="text-green-600 font-bold">
            ✓ Alias is available!
          </span>
        );
      case "taken":
        return (
          <span className="text-red-600 font-bold">
            ✗ This alias is already taken
          </span>
        );
      case "invalid":
        return (
          <span className="text-red-600 font-bold">
            ✗ Alias must be at least 3 characters
          </span>
        );
      default:
        return null;
    }
  };

  const canProceed = validationStatus === "available" && alias.length >= 3;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="border-4 border-black rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
        {/* Header with Progress */}
        <div className="p-6 border-b-4 border-black bg-primary text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black text-gray-900">
              Create Your Alias
            </h2>
            <div className="flex items-center gap-3">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full border-4 border-black flex items-center justify-center font-black text-lg transition-all",
                      step < currentStep && "bg-green-500 text-black",
                      step === currentStep && "bg-primary text-black",
                      step > currentStep && "bg-white text-gray-400"
                    )}
                  >
                    {step < currentStep ? <Check className="h-5 w-5" /> : step}
                  </div>
                  {step < 3 && (
                    <div
                      className={cn(
                        "w-8 h-1 mx-2 transition-all",
                        step < currentStep ? "bg-green-500" : "bg-gray-300"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Labels */}
        </div>

        {/* Step Content */}
        <div className="p-8">
          {/* Step 1: Alias Input */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/80 to-primary rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-black" />
                </div>
                <h3 className="text-2xl font-black mb-2">Choose Your Alias</h3>
                <p className="text-gray-600 font-medium">
                  Create a unique alias for your TEPAY payment link
                </p>
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-black">
                  Enter your desired alias
                </Label>

                <div className="relative">
                  <div className="flex items-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-12 h-12 rounded-2xl border-4 border-black p-0 hover:bg-primary !cursor-pointer",
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
                              onClick={() => {
                                setSelectedIcon(option);
                              }}
                            >
                              <span className="text-lg">{option.emoji}</span>
                            </DropdownMenuItem>
                          ))}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="relative flex-1 ml-2">
                      <Input
                        value={alias}
                        onChange={(e) => handleAliasChange(e.target.value)}
                        placeholder="your-alias"
                        className="border-4 border-black rounded-xl font-bold text-lg h-12 pr-12"
                        maxLength={30}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {getValidationIcon()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Validation Message */}
                <div className="min-h-[24px] flex items-center">
                  {getValidationMessage()}
                </div>

                {/* Guidelines */}
                <Card className="border-2 border-gray-300 rounded-xl p-4 bg-gray-50">
                  <h4 className="font-bold mb-2">Alias Guidelines:</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Must be at least 3 characters long</li>
                    <li>• Only letters, numbers, and hyphens allowed</li>
                    <li>• Cannot start or end with a hyphen</li>
                    <li>• Must be unique across all TEPAY users</li>
                  </ul>
                </Card>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className="bg-primary hover:bg-primary/80 disabled:bg-gray-300 disabled:text-gray-500 text-black rounded-xl border-4 border-black font-black px-8 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  Continue <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Alias Preview */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-black mb-2">Preview Your Alias</h3>
                <p className="text-gray-600 font-medium">
                  Review how your alias will appear to others
                </p>
              </div>

              {/* Preview Card */}
              <Card className="border-4 border-primary rounded-xl p-6 bg-gradient-to-br from-blue-50 to-purple-50 shadow-[8px_8px_0px_0px_rgba(59,130,246,0.3)]">
                <div className="text-center">
                  <h4 className="text-xl font-black mb-2">Your TEPAY Alias</h4>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-12 h-12 rounded-2xl border-2 border-black p-0 hover:bg-primary !cursor-pointer mb-4",
                      selectedIcon.color
                    )}
                  >
                    <span className="text-2xl">{selectedIcon.emoji}</span>
                  </Button>
                  <div className="bg-white border-2 border-black rounded-xl p-4 mb-4">
                    <p className="text-2xl font-black text-primary break-all">
                      {window.location.host}/send/{alias}
                    </p>
                  </div>

                  <p className="text-gray-600 font-medium mb-4">
                    This will be your personalized payment link that you can
                    share with anyone
                  </p>

                  <div className="flex justify-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-2 border-black rounded-xl"
                      onClick={copyToClipboard}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-2 border-black rounded-xl"
                      onClick={openLink}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Summary */}
              <Card className="border-2 border-gray-300 rounded-xl p-4 bg-gray-50">
                <h4 className="font-bold mb-2">Summary:</h4>
                <ul className="text-sm space-y-1">
                  <li>
                    <strong>Icon:</strong> {selectedIcon.name}{" "}
                    <span className="text-sm text-gray-500">
                      ({selectedIcon.emoji})
                    </span>
                  </li>
                  <li>
                    <strong>Alias:</strong> {alias}
                  </li>
                  <li>
                    <strong>Full URL:</strong> {window.location.host}/send/
                    {alias}
                  </li>
                  <li>
                    <strong>Status:</strong>{" "}
                    <span className="text-green-600 font-bold">Available</span>
                  </li>
                </ul>
              </Card>

              <div className="flex justify-between pt-4">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="border-2 border-black rounded-xl font-bold px-6 py-3"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" /> Back
                </Button>

                <Button
                  onClick={handleConfirmAlias}
                  disabled={isCreating}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-xl border-4 border-black font-black px-8 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Confirm Alias <Check className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <CheckCircle className="h-12 w-12 text-white" />
                </div>

                <h3 className="text-3xl font-black mb-4 text-green-700">
                  Alias Created Successfully! 🎉
                </h3>

                <p className="text-gray-600 font-medium text-lg mb-8">
                  Your personalized TEPAY alias is now ready to use
                </p>

                {/* Success Card */}
                <Card className="border-4 border-green-500 rounded-xl p-6 bg-gradient-to-br from-green-50 to-green-100 shadow-[8px_8px_0px_0px_rgba(34,197,94,0.3)] mb-6">
                  <div className="space-y-4">
                    <div className="bg-white border-2 border-green-300 rounded-xl p-4">
                      <p className="text-2xl font-black text-green-700 break-all">
                        {window.location.host}/send/{alias}
                      </p>
                    </div>

                    <p className="text-green-700 font-bold">
                      Your alias is now active and ready to receive payments!
                    </p>

                    <div className="flex justify-center gap-3">
                      <Button
                        variant="outline"
                        className="border-2 border-green-500 text-green-700 hover:bg-green-50 rounded-xl font-bold"
                        onClick={copyToClipboard}
                      >
                        <Copy className="h-4 w-4 mr-2" /> Copy Link
                      </Button>
                      <Button
                        variant="outline"
                        className="border-2 border-green-500 text-green-700 hover:bg-green-50 rounded-xl font-bold"
                        onClick={openLink}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" /> Open Link
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Next Steps */}
                <Card className="border-2 border-gray-300 rounded-xl p-4 bg-gray-50 text-left">
                  <h4 className="font-bold mb-3">What's Next?</h4>
                  <ul className="text-sm space-y-2 text-gray-600">
                    <li>• Share your alias link with friends and customers</li>
                    <li>• Customize your payment link settings</li>
                    <li>• Set up notifications for incoming payments</li>
                    <li>• View your payment history and analytics</li>
                  </ul>
                </Card>

                <div className="flex justify-center pt-6">
                  <Button
                    onClick={handleComplete}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-xl border-4 border-black font-black px-12 py-4 text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Go to Dashboard <MoveRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
