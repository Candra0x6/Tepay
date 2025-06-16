

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function InternetIdentityButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleInternetIdentityLogin = async () => {
    setIsLoading(true)

    try {
      // Simulate Internet Identity authentication
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real app, you would integrate with Internet Identity here
      // This would typically involve redirecting to the II service
      // and handling the callback with authentication data

      // For now, we'll just redirect to the dashboard
    } catch (err) {
      console.error("Internet Identity authentication failed", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="outline" className="w-full" onClick={handleInternetIdentityLogin} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Authenticating...
        </>
      ) : (
        <>
          <svg
            className="mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
            <line x1="21.17" y1="8" x2="12" y2="8" />
            <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
            <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
          </svg>
          Internet Identity
        </>
      )}
    </Button>
  )
}
