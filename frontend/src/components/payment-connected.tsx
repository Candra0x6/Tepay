"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Smile, Sun, Coins, CreditCard } from "lucide-react";
import TepayLogo from "./tepay-logo";
import useTokenOperations from "@/hooks/use-token-canister-calls";
import {
  formatPrincipal,
  formatVPTAmount,
  parseVPTAmount,
} from "@/utils/vaultPayUtils";
import { parse } from "path";
import { useAuth } from "@/hooks/use-auth-client";
import { Principal } from "@dfinity/principal";
import useAliasOperations from "@/hooks/use-alias-operation";
import { AliasEntry } from "@declarations/alias_registry/alias_registry.did";
import { principal } from "@ic-reactor/react/dist/utils";
interface PaymentConnectedProps {
  alias: string;
}

export default function PaymentConnected({ alias }: PaymentConnectedProps) {
  const [amount, setAmount] = useState<string>();
  const [balance, setBalance] = useState<bigint>();
  const [linkInfo, setLinkInfo] = useState<AliasEntry>();
  const { logout, principal, identity } = useAuth();
  const { getUserBalance, performTransfer } = useTokenOperations();
  const { getAliasInfo } = useAliasOperations();
  const handleMaxAmount = () => {
    setAmount(formatVPTAmount(balance as bigint));
  };

  const handlePay = async () => {
    const amountInVPT = parseVPTAmount(amount || "0");
    if (amountInVPT <= 0n || !principal) {
      console.error("Invalid amount or principal");
      return;
    }
    await performTransfer(linkInfo?.owner as Principal, amountInVPT);
  };

  useEffect(() => {
    // Fetch user balance when component mounts
    const fetchBalance = async () => {
      const balance = await getUserBalance();
      setBalance(balance as bigint);
    };
    const fetchAliasInfo = async () => {
      const aliasInfo = await getAliasInfo(alias);
      if (aliasInfo) {
        setLinkInfo(aliasInfo);
      } else {
        console.error("Failed to fetch alias info");
      }
    };
    fetchAliasInfo();
    fetchBalance();
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Validate input to allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  return (
    <div className="min-h-screen  flex justify-center p-8">
      {/* Main Payment Card */}
      <Card className="w-full max-w-md bg-white border-4 border-black rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-8 h-fit">
        {/* TEPAY Logo */}
        <TepayLogo className="w-28 aspect-square mx-auto mb-6" />

        {/* Wallet Status */}
        <div className="text-center mb-6 p-3 bg-green-50 border-2 border-green-200 rounded-xl">
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm font-bold text-gray-700">Connected:</span>
            <span className="font-black">
              {formatPrincipal(principal as Principal)}
            </span>
            <button
              onClick={logout}
              className="text-orange-500 hover:text-orange-600 font-bold text-sm underline ml-2"
            >
              Disconnect
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black mb-2">Send funds to {alias}</h2>
          <p className="text-gray-600 font-medium">
            secure & Immutable payment •{" "}
            <span className="text-blue-600 font-bold">personal</span>
          </p>
        </div>

        {/* Custom Amount Card */}
        <Card className="border-4 border-black rounded-xl p-4 mb-6 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Sun className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-black">Custom Amount</h3>
              <p className="text-sm text-gray-600 font-medium">
                Choose how much to send
              </p>
            </div>
          </div>
        </Card>

        {/* Payment Method Selector */}
        <div>
          {/* Balance Display */}
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 font-medium">
              Balance:{" "}
              <span className="font-black">
                {formatVPTAmount(balance as bigint) + " VPT"}
              </span>
            </p>
          </div>

          {/* Amount Input */}
          <div className="relative mb-6">
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => handleAmountChange(e)}
              className="border-2 border-black rounded-xl font-bold text-lg pr-16 h-14"
            />
            <Button
              onClick={handleMaxAmount}
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2 font-black text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              MAX
            </Button>
          </div>
        </div>

        {/* Pay Button */}
        <Button
          onClick={handlePay}
          disabled={!amount || Number.parseFloat(amount) <= 0}
          className="w-full h-14 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-xl border-4 border-black font-black text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6 flex items-center justify-center gap-3"
        >
          <Coins className="h-6 w-6" />
          Pay
        </Button>

        {/* Bottom Security Label */}
        <div className="text-center">
          <p className="text-sm text-gray-500 font-medium">
            Secured by <span className="font-black text-black">TEPAY</span> •
            Self-custodial payments
          </p>
        </div>
      </Card>
    </div>
  );
}
