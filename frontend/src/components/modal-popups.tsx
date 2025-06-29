"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

// Payment Success Modal
export function PaymentSuccessModal({
  isOpen,
  onClose,
  autoClose = true,
  autoCloseDelay = 3000,
}: ModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setShowConfetti(true);

      if (autoClose) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(onClose, 300); // Wait for fade out animation
        }, autoCloseDelay);

        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
      setShowConfetti(false);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      {/* Confetti Background */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute w-2 h-2 rounded-full animate-bounce",
                i % 4 === 0 && "bg-green-400",
                i % 4 === 1 && "bg-yellow-400",
                i % 4 === 2 && "bg-blue-400",
                i % 4 === 3 && "bg-pink-400"
              )}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            />
          ))}
        </div>
      )}

      <Card
        className={cn(
          "w-full max-w-sm bg-white border-4 border-black rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6 text-center transition-all duration-300",
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}
      >
        {/* Animated Success Icon */}
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <CheckCircle className="h-12 w-12 text-white animate-bounce" />
          </div>
          <div className="absolute inset-0 w-20 h-20 bg-green-400/30 rounded-full mx-auto animate-ping"></div>
        </div>

        <h2 className="text-2xl font-black mb-3 text-gray-900">
          Payment Sent!
        </h2>

        <p className="text-gray-600 font-medium mb-4">
          Your payment to <span className="font-bold text-black">khkh</span> has
          been successfully processed.
        </p>

        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 mb-4">
          <p className="font-black text-lg text-green-700">💸 1.25 SOL</p>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-1 mb-2">
          <div
            className="bg-green-500 h-1 rounded-full transition-all duration-300 ease-linear"
            style={{
              width: isVisible ? "0%" : "100%",
              transition: `width ${autoCloseDelay}ms linear`,
            }}
          ></div>
        </div>
        <p className="text-xs text-gray-400">Auto-closing...</p>
      </Card>
    </div>
  );
}

// Payment Failure Modal
export function PaymentFailureModal({
  isOpen,
  onClose,
  autoClose = true,
  autoCloseDelay = 3000,
}: ModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);

      if (autoClose) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }, autoCloseDelay);

        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card
        className={cn(
          "w-full max-w-sm bg-white border-4 border-black rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6 text-center transition-all duration-300",
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}
      >
        {/* Error Icon */}
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="h-12 w-12 text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-black mb-3 text-gray-900">
          Payment Failed
        </h2>

        <p className="text-gray-600 font-medium mb-4">
          Something went wrong. Please check your wallet and try again.
        </p>

        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 mb-6">
          <p className="text-sm text-red-700 font-medium">
            Possible causes: Insufficient funds, network error, or wallet not
            authorized
          </p>
        </div>

        <Button
          onClick={onClose}
          variant="outline"
          className="w-full border-2 border-black rounded-xl font-bold mb-4"
        >
          Cancel
        </Button>

        <div className="w-full bg-gray-200 rounded-full h-1 mb-2">
          <div
            className="bg-red-500 h-1 rounded-full transition-all duration-300 ease-linear"
            style={{
              width: isVisible ? "0%" : "100%",
              transition: `width ${autoCloseDelay}ms linear`,
            }}
          ></div>
        </div>
        <p className="text-xs text-gray-400">Auto-closing...</p>
      </Card>
    </div>
  );
}

// Edit Success Modal
export function EditSuccessModal({
  isOpen,
  onClose,
  autoClose = true,
  autoCloseDelay = 3000,
}: ModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);

      if (autoClose) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }, autoCloseDelay);

        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card
        className={cn(
          "w-full max-w-sm bg-white border-4 border-black rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6 text-center transition-all duration-300",
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}
      >
        {/* Edit Success Icon */}
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Edit3 className="h-12 w-12 text-white" />
          </div>
          <div className="absolute inset-0 w-20 h-20 bg-blue-400/30 rounded-full mx-auto animate-ping"></div>
        </div>

        <h2 className="text-2xl font-black mb-3 text-gray-900">
          Changes Saved!
        </h2>

        <p className="text-gray-600 font-medium mb-6">
          Your link settings have been successfully updated.
        </p>

        <div className="w-full bg-gray-200 rounded-full h-1 mb-2">
          <div
            className="bg-blue-500 h-1 rounded-full transition-all duration-300 ease-linear"
            style={{
              width: isVisible ? "0%" : "100%",
              transition: `width ${autoCloseDelay}ms linear`,
            }}
          ></div>
        </div>
        <p className="text-xs text-gray-400">Auto-closing...</p>
      </Card>
    </div>
  );
}

// Demo Component to test all modals
export function ModalDemo() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (modalType: string) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white border-4 border-black rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🧪</span>
          </div>
          <h1 className="text-2xl font-black">Modal Demo</h1>
          <p className="text-gray-600">Test TEPAY modal popups</p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => openModal("success")}
            className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl border-2 border-black font-bold"
          >
            Show Payment Success
          </Button>

          <Button
            onClick={() => openModal("failure")}
            className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl border-2 border-black font-bold"
          >
            Show Payment Failure
          </Button>

          <Button
            onClick={() => openModal("edit")}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl border-2 border-black font-bold"
          >
            Show Edit Success
          </Button>
        </div>
      </Card>

      {/* Modals */}
      <PaymentSuccessModal
        isOpen={activeModal === "success"}
        onClose={closeModal}
      />

      <PaymentFailureModal
        isOpen={activeModal === "failure"}
        onClose={closeModal}
      />

      <EditSuccessModal isOpen={activeModal === "edit"} onClose={closeModal} />
    </div>
  );
}
