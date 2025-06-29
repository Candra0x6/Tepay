import AliasStepper from "@/components/alias-stepper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

// Demo component to test the stepper
export function NameSetupPage() {
  const [showStepper, setShowStepper] = useState(false);

  const handleComplete = (alias: string) => {
    toast.success(`Alias "${alias}" created successfully!`);
  };

  return (
    <div className="min-h-screen bg-gbackground">
      {!showStepper ? (
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md bg-white border-4 border-black rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 border-black border-2">
                <User className="h-8 w-8 text-black" />
              </div>
              <h1 className="text-2xl font-black mb-2">Create Your Alias</h1>
              <p className="text-gray-600 mb-6">
                Set up a personalized Tepay payment link
              </p>

              <Button
                onClick={() => setShowStepper(true)}
                className="w-full bg-primary text-foreground rounded-xl border-2 border-black font-bold h-12"
              >
                Get Started
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <div className="py-8">
          <AliasStepper
            onComplete={handleComplete}
            onClose={() => setShowStepper(false)}
          />
        </div>
      )}
    </div>
  );
}
