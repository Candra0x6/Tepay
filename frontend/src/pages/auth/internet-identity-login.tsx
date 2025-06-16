

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, ArrowLeft, ExternalLink, Shield, Key, Fingerprint, CheckCircle } from "lucide-react"
import InternetIdentitySteps from "@/components/auth/internet-idetity-steps"
import { useAuth } from "@/utility/use-auth-client"
import { useNavigate } from "react-router-dom"

export default function InternetIdentityPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"new" | "existing">("existing")
  const { login } = useAuth()
  const navigate = useNavigate()
  const handleAuthenticate = async () => {
    setIsLoading(true)

    try {
      // Simulate Internet Identity authentication
      await login()

      navigate("/auth")
    } catch (err) {
      console.error("Internet Identity authentication failed", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col pt-20">


      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Internet Identity Authentication</h1>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
              Secure, anonymous, and convenient. Internet Identity is the recommended authentication method for Fundly.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-8">
            {/* Left Column - Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-2"
            >
              <h2 className="text-xl font-semibold mb-4">Why Internet Identity?</h2>

              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Enhanced Security</h3>
                      <p className="text-sm text-zinc-600">
                        Cryptographically secure authentication without passwords that can be stolen or forgotten.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Fingerprint className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Privacy Focused</h3>
                      <p className="text-sm text-zinc-600">
                        Your identity is pseudonymous and your data remains under your control.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Key className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">One Identity, Many Services</h3>
                      <p className="text-sm text-zinc-600">
                        Use the same Internet Identity across multiple platforms and services.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Seamless Experience</h3>
                      <p className="text-sm text-zinc-600">
                        Quick and easy authentication without the need to remember complex passwords.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Right Column - Authentication */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-3"
            >
              <Card className="border border-zinc-200">
                <CardContent className="p-6">
                  <Tabs defaultValue="existing" onValueChange={(value) => setActiveTab(value as "new" | "existing")}>
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="existing">I have Internet Identity</TabsTrigger>
                      <TabsTrigger value="new">I need Internet Identity</TabsTrigger>
                    </TabsList>

                    <TabsContent value="existing">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold mb-2">Sign in with Internet Identity</h3>
                        <p className="text-zinc-600 text-sm">
                          Use your existing Internet Identity to securely authenticate with Fundly.
                        </p>
                      </div>

                      <div className="flex justify-center mb-6">
                        <div className="h-24 w-24 rounded-full bg-emerald-50 flex items-center justify-center">
                          <svg
                            className="h-12 w-12 text-emerald-600"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <circle cx="12" cy="12" r="4" />
                            <line x1="21.17" y1="8" x2="12" y2="8" />
                            <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
                            <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
                          </svg>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-emerald-500 hover:bg-emerald-600 h-12 text-base mb-4"
                        onClick={handleAuthenticate}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Authenticating...
                          </>
                        ) : (
                          <>Authenticate with Internet Identity</>
                        )}
                      </Button>

                      <p className="text-sm text-zinc-500 text-center">
                        You'll be redirected to the Internet Identity service to complete authentication.
                      </p>
                    </TabsContent>

                    <TabsContent value="new">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold mb-2">Create an Internet Identity</h3>
                        <p className="text-zinc-600 text-sm">
                          Follow these steps to create your Internet Identity and connect with Fundly.
                        </p>
                      </div>

                      <InternetIdentitySteps />

                      <div className="mt-6">
                        <Button
                          className="w-full bg-emerald-500 hover:bg-emerald-600 h-12 text-base"
                          onClick={() => window.open("https://identity.ic0.app/", "_blank")}
                        >
                          Create Internet Identity
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>

                        <p className="text-sm text-zinc-500 text-center mt-4">
                          After creating your Internet Identity, return to this page and select "I have Internet
                          Identity" to continue.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg text-blue-700 text-sm flex items-start gap-2">
                <svg
                  className="h-5 w-5 flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                <div>
                  <p className="font-medium mb-1">Need help with Internet Identity?</p>
                  <p>
                    Visit the{" "}
                    <a
                      href="https://internetcomputer.org/docs/current/tokenomics/identity-auth/auth-how-to"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 underline hover:text-blue-800"
                    >
                      Internet Identity documentation
                    </a>{" "}
                    for detailed instructions and troubleshooting.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">What is Internet Identity?</h3>
                  <p className="text-sm text-zinc-600">
                    Internet Identity is a blockchain-based authentication system that allows you to securely access
                    applications without usernames or passwords.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Is Internet Identity secure?</h3>
                  <p className="text-sm text-zinc-600">
                    Yes, Internet Identity uses cryptographic authentication methods that are more secure than
                    traditional password-based systems.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Can I use Internet Identity on multiple devices?</h3>
                  <p className="text-sm text-zinc-600">
                    Yes, you can add multiple devices to your Internet Identity for seamless access across all your
                    devices.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">What if I lose access to my device?</h3>
                  <p className="text-sm text-zinc-600">
                    Internet Identity allows you to set up recovery methods to regain access to your identity if you
                    lose your device.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}

    </div>
  )
}
