
import Image from "next/image"
import { ForgotForm } from "../_components/forgot-password"

export default function ForgotPasswordPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      <div className="hidden lg:flex items-center justify-center p-8">
        <Image
          src="/images/auth_page.webp"
          alt="Shopping illustration"
          width={900}
          height={900}
          className="object-contain"
        />
      </div>
      <div className="flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Forgot Password?</h2>
            <p className="text-muted-foreground">Enter your email to reset your password</p>
          </div>
          <ForgotForm />
        </div>
      </div>
    </div>
  )
}
