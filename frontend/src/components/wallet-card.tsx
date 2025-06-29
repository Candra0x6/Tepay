"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Smile,
  Paintbrush,
  Shield,
  Zap,
  Copy,
  ExternalLink,
} from "lucide-react";
import TepayLogo from "./tepay-logo";
import { useAuth } from "@/hooks/use-auth-client";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function CryptoCard() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const navigate = useNavigate();
  const handleCopyLink = () => {
    navigator.clipboard.writeText("TEPAY.me/maya/commission");
  };

  const handleAuthenticate = async () => {
    setIsLoading(true);

    try {
      // Simulate Internet Identity authentication
      await login();

      toast.success("Successfully authenticated with Internet Identity!");
    } catch (err) {
      console.error("Internet Identity authentication failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto neumorphic-border">
        <div className="grid lg:grid-cols-2 w-full h-full rounded-xl overflow-hidden  bg-white relative">
          {/* Left Column - Main Content */}
          <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
            {/* Header with Logo and Chain Selector */}
            <TepayLogo className="w-20 aspect-square" />

            {/* Main Headline */}
            <div className="mb-8">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 leading-tight">
                Get Tipped,
                <br />
                Stay Sovereign
              </h2>
              <p className="text-lg text-gray-700 max-w-md">
                Start receiving payments globally in seconds—no KYC, no
                gatekeepers.
              </p>
            </div>

            {/* Payment Link Card */}
            <Card className="border-4 border-black rounded-xl p-4 mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Paintbrush className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600">
                      Sample Payment Link
                    </p>
                    <p className="font-bold">tepay/maya/commission</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-2 border-black rounded-xl"
                    onClick={handleCopyLink}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-2 border-black rounded-xl"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Connect Internet Identity Button */}
            <Button
              onClick={handleAuthenticate}
              className="w-full h-14 bg-green-500 hover:bg-green-600 text-white rounded-xl border-2 border-black font-bold text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6"
            >
              Auth with Internet Identity
            </Button>

            {/* Announcement Boxes */}
            <div className="space-y-3">
              <Card className="border-4 border-black rounded-xl p-4 bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-black" />
                  <div>
                    <p className="font-bold text-black">
                      Currently live on ICP Mainnet
                    </p>
                    <p className="text-sm text-black/80">Testing phase</p>
                  </div>
                </div>
              </Card>

              <Card className="border-4 border-black rounded-xl p-4 bg-gradient-to-r from-blue-400 to-blue-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-white" />
                  <div>
                    <p className="font-bold text-white">
                      Your transaction is yours
                    </p>
                    <p className="text-sm text-white/90">
                      Immutable, secure, and fully decentralized
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Right Column - Multimedia Content */}
          <div className="bg-gradient-to-br from-primary to-orange-400 p-6 sm:p-8 lg:p-12 flex flex-col justify-center items-center text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-20 h-20 border-4 border-white rounded-xl rotate-12"></div>
              <div className="absolute top-32 right-16 w-16 h-16 border-4 border-white rounded-full"></div>
              <div className="absolute bottom-20 left-20 w-12 h-12 border-4 border-white rounded-lg rotate-45"></div>
              <div className="absolute bottom-32 right-12 w-24 h-24 border-4 border-white rounded-xl -rotate-12"></div>
            </div>

            {/* Main Visual Content */}
            <div className="relative z-10 text-center">
              <div className="w-full flex justify-center">
                <TepayLogo className="w-28 aspect-square" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-black mb-4">
                Earn Trustless
              </h3>
              <p className="text-lg mb-8 max-w-sm mx-auto opacity-90 text-black/80">
                Your transaction is transparent, secure, and forever on-chain.
              </p>

              {/* Feature Badges */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <Badge className="bg-primary/20 text-black border-2 border-black/30 rounded-xl px-4 py-2 font-bold">
                  Zero-Knowledge
                </Badge>
                <Badge className="bg-primary/20 text-black border-2 border-black/30 rounded-xl px-4 py-2 font-bold">
                  Instant Payments
                </Badge>
                <Badge className="bg-primary/20 text-black border-2 border-black/30 rounded-xl px-4 py-2 font-bold">
                  Low Fees
                </Badge>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-primary/10 backdrop-blur-md rounded-xl p-4 border-2 border-black/20 text-black">
                  <p className="text-2xl font-black">100%</p>
                  <p className="text-sm opacity-80">Secure</p>
                </div>
                <div className="bg-primary/10 backdrop-blur-md rounded-xl p-4 border-2 border-black/20 text-black">
                  <p className="text-2xl font-black">0.01s</p>
                  <p className="text-sm opacity-80">Speed</p>
                </div>
                <div className="bg-primary/10 backdrop-blur-md rounded-xl p-4 border-2 border-black/20 text-black">
                  <p className="text-2xl font-black">$0</p>
                  <p className="text-sm opacity-80">Fee</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
