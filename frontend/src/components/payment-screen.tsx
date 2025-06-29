"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Smile, Sun, Wallet, CreditCard } from "lucide-react";
import TepayLogo from "./tepay-logo";
import { useAuth } from "@/hooks/use-auth-client";

interface PaymentScreenProps {
  alias: string;
}

export default function PaymentScreen({ alias }: PaymentScreenProps) {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Main Payment Card */}
      <Card className="w-full max-w-md bg-white border-4 border-black rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-8">
        {/* TEPAY Logo */}
        <TepayLogo className="w-28 aspect-square mx-auto mb-6" />

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black mb-2">Send funds to {alias}</h2>
          <p className="text-gray-600 font-medium">
            secure & Immutable payment •{" "}
            <span className="text-blue-600 font-bold">personal</span>
          </p>
        </div>

        {/* Custom Amount Card */}
        <Card className="border-4 border-black rounded-xl p-6 mb-8 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Sun className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-black text-lg">Custom Amount</h3>
              <p className="text-gray-600 font-medium">
                Choose how much to send
              </p>
            </div>
          </div>
        </Card>

        {/* Connect Wallet Button */}
        <Button
          onClick={login}
          className="w-full h-14 bg-green-500 hover:bg-green-600 text-white rounded-xl border-4 border-black font-black text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6 flex items-center justify-center gap-3"
        >
          <Wallet className="h-6 w-6" />
          Connect Identity to continue
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
