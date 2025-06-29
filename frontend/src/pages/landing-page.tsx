import CryptoCard from "@/components/wallet-card";
import { useAuth } from "@/hooks/use-auth-client";
import { useEffect } from "react";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  isAuthenticated && window.location.replace("/dashboard");
  return <CryptoCard />;
}
