

import { motion } from "framer-motion"

export default function InternetIdentitySteps() {
  const steps = [
    {
      title: "Visit the Internet Identity Service",
      description: "Click the button below to open the Internet Identity service in a new tab.",
    },
    {
      title: "Create a New Identity",
      description: "Click on 'Create New' and follow the on-screen instructions to set up your identity.",
    },
    {
      title: "Secure Your Identity",
      description: "Set up a recovery method such as a seed phrase or security key to protect your identity.",
    },
    {
      title: "Return to Fundly",
      description: "Once your Internet Identity is created, return to this page and click 'I have Internet Identity'.",
    },
  ]

  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="flex gap-4"
        >
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-medium">
              {index + 1}
            </div>
          </div>
          <div>
            <h4 className="font-medium">{step.title}</h4>
            <p className="text-sm text-zinc-600 mt-1">{step.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
