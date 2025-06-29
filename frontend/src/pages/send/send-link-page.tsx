import PaymentConnected from "@/components/payment-connected";
import PaymentScreen from "@/components/payment-screen";
import { useAuth } from "@/hooks/use-auth-client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PaymentPage() {
  const { alias } = useParams();
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    console.log("testing");
  }, []);

  return isAuthenticated ? (
    <PaymentConnected alias={alias as string} />
  ) : (
    <PaymentScreen alias={alias as string} />
  );
}
