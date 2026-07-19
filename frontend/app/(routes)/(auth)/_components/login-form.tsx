"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ZodError } from "zod"
import { LoginInput, loginSchema } from "./lib/validation"
import { handleLogin } from "@/lib/actions/auth-action"
import { toast } from "sonner"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<LoginInput>>({})
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      const validatedData = loginSchema.parse({
        email,
        password,
      })
      const res = await handleLogin(validatedData)
      if (res.success) {
        toast.success("Login successful!")
        router.push("/login")
      }else{
        toast.error(res.message || "Login failed. Please try again.")
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Partial<LoginInput> = {}
        error.issues.forEach((err) => {
          const field = err.path[0] as keyof LoginInput
          fieldErrors[field] = err.message 
        })
        setErrors(fieldErrors)
        toast.error("Please fix the errors in the form.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
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
      </div>

      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-accent hover:opacity-90 text-accent-foreground px-12 py-2 rounded transition-colors"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </Button>
          <Link href="/forgot-password" className="text-sm text-foreground hover:underline">
            Forget Password?
          </Link>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full py-3 rounded border border-foreground hover:bg-muted bg-transparent"
        ></Button>
        <p className="text-center text-sm">
          Dont have an account?{" "}
          <Link href="/register" className="text-foreground font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </form>
  )
}
