"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NavbarShell } from "@/components/shared/navbar-shell"
import { Footer } from "@/components/shared/footer"
import { LIGHT_PAGE_SURFACE } from "@/lib/light-page-surface"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsSubmitted(true)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className={LIGHT_PAGE_SURFACE.shell}>
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className={`mx-auto w-full max-w-md rounded-[2rem] p-8 shadow-sm ${LIGHT_PAGE_SURFACE.card}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>

            {!isSubmitted ? (
              <>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Reset your password
                </h1>
                <p className="text-slate-600 mb-8">
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`pl-10 ${LIGHT_PAGE_SURFACE.input}`}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className={`w-full ${LIGHT_PAGE_SURFACE.action}`} disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send reset link"}
                  </Button>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-emerald-500/15 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Check your email
                </h1>
                <p className="text-slate-600 mb-8">
                  We&apos;ve sent a password reset link to <strong>{email}</strong>
                </p>
                <Button asChild variant="outline" className="w-full border-slate-200">
                  <Link href="/login">Back to login</Link>
                </Button>
                <p className="mt-6 text-sm text-slate-600">
                  Didn&apos;t receive the email?{" "}
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="font-medium text-sky-700 hover:underline"
                  >
                    Try again
                  </button>
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
