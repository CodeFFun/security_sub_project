"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ZodError } from "zod"
import { RegisterInput, registerSchema } from "./lib/validation"
import { handleRegister } from "@/lib/actions/auth-action"
import { toast } from "sonner"

// Client-side strength feedback. Mirrors the server policy (>=8 chars, letter
// + number) and rewards length/variety. Purely advisory — the backend is the
// authoritative check.
function scorePassword(pw: string): { score: number; label: string; color: string } {
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const levels = [
    { label: "Too weak", color: "bg-destructive" },
    { label: "Weak", color: "bg-destructive" },
    { label: "Fair", color: "bg-accent" },
    { label: "Good", color: "bg-accent" },
    { label: "Strong", color: "bg-primary" },
    { label: "Very strong", color: "bg-primary" },
  ]
  return { score, ...levels[score] }
}

export function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState<"customer" | "shop" | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<RegisterInput>>({})
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      const validatedData = registerSchema.parse({
        username: name,
        email,
        password,
        role: userType !== null ? userType : "customer",
      })
      // console.log(userType)
      // console.log("Validated Data:", validatedData)
      const res = await handleRegister(validatedData)
      if (res.success) {
        toast("Registration successful!")
        router.push("/login")
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Partial<RegisterInput> = {}
        error.issues.forEach((err) => {
          const field = err.path[0] as keyof RegisterInput
          fieldErrors[field] = err.message 
        })
        setErrors(fieldErrors)
        toast("Please fix the errors in the form.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div>
        <label htmlFor="name" className="sr-only">
          Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`w-full bg-transparent py-3 px-0 placeholder-muted-foreground focus:outline-none transition-colors ${
            errors.username ? "border-b-2 border-destructive" : "border-b border-muted-foreground"
          }`}
          required
        />
        {errors.username && <p className="text-destructive text-sm mt-1">{errors.username}</p>}
      </div>

      <div>
        <label htmlFor="email" className="sr-only">
          Email or Phone Number
        </label>
        <input
          id="email"
          type="text"
          placeholder="Email or Phone Number"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full bg-transparent py-3 px-0 placeholder-muted-foreground focus:outline-none transition-colors ${
            errors.email ? "border-b-2 border-destructive" : "border-b border-muted-foreground"
          }`}
          required
        />
        {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full bg-transparent py-3 px-0 placeholder-muted-foreground focus:outline-none transition-colors ${
            errors.password ? "border-b-2 border-destructive" : "border-b border-muted-foreground"
          }`}
          required
        />
        {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
        {password.length > 0 && (() => {
          const s = scorePassword(password)
          return (
            <div className="mt-2">
              <div className="flex gap-1" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i < s.score ? s.color : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs mt-1 text-muted-foreground">
                Password strength: <span className="font-medium">{s.label}</span>
                {s.score < 2 && " — use 8+ characters with letters and numbers"}
              </p>
            </div>
          )
        })()}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">I am a:</span>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setUserType("customer")}
            className={`px-4 py-2 rounded-md transition-colors ${
              userType === "customer"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setUserType("shop")}
            className={`px-4 py-2 rounded-md transition-colors ${
              userType === "shop"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            Shopkeeper
          </button>
        </div>
      </div>

      <div className="space-y-3 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground py-3 rounded hover:opacity-90 transition-opacity"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full py-3 rounded border border-foreground hover:bg-muted bg-transparent"
        ></Button>
      </div>

      <p className="text-center text-sm">
        Already have account?{" "}
        <Link href="/login" className="text-foreground font-medium hover:underline">
          Log in
        </Link>
      </p>
    </form>
  )
}
