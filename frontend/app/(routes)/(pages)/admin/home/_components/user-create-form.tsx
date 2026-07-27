"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ZodError } from "zod"
import { handleCreateUser } from "@/lib/actions/admin-action"
import { toast } from "sonner"
import Image from "next/image"

export function UserCreateForm() {
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    alternateEmail: "",
    password: "",
    phoneNumber: "",
    profilePicture: "",
    role: "" as "customer" | "shop",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<any>({})
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profilePicture: reader.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRoleChange = (newRole: "customer" | "shop") => {
    setFormData((prev) => ({
      ...prev,
      role: newRole,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {

      const res = await handleCreateUser(formData)
      if (res.success) {
        toast.success("User created successfully!")
        router.push("/admin/home")
      } else {
        toast.error(res.message || "Failed to create user")
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors:any = {}
        error.issues.forEach((err) => {
          const field = err.path[0]
          fieldErrors[field] = err.message
        })
        setErrors(fieldErrors)
        toast.error("Please fix the errors in the form.")
      } else {
        toast.error("An error occurred while creating user")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div>
        <label htmlFor="profilePicture" className="block text-sm font-medium mb-2">
          Profile Picture
        </label>
        <input
          id="profilePicture"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full px-4 py-2 border border-muted-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
        />
        {formData.profilePicture && (
          <div className="mt-2">
            <Image
              src={formData.profilePicture}
              alt="Profile preview"
              className="w-20 h-20 rounded-full object-cover"
            />
          </div>
        )}
      </div>
      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-2">
          Username
        </label>
        <input
          id="username"
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
          className={`w-full bg-transparent py-3 px-4 placeholder-muted-foreground focus:outline-none transition-colors rounded-md ${
            errors.username ? "border-2 border-destructive" : "border border-muted-foreground"
          }`}
          required
        />
        {errors.username && <p className="text-destructive text-sm mt-1">{errors.username}</p>}
      </div>
      <div>
        <label htmlFor="fullname" className="block text-sm font-medium mb-2">
          Full Name
        </label>
        <input
          id="fullname"
          type="text"
          name="fullname"
          placeholder="Full Name"
          value={formData.fullname}
          onChange={handleInputChange}
          className={`w-full bg-transparent py-3 px-4 placeholder-muted-foreground focus:outline-none transition-colors rounded-md ${
            errors.fullname ? "border-2 border-destructive" : "border border-muted-foreground"
          }`}
          required
        />
        {errors.fullname && <p className="text-destructive text-sm mt-1">{errors.fullname}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          className={`w-full bg-transparent py-3 px-4 placeholder-muted-foreground focus:outline-none transition-colors rounded-md ${
            errors.email ? "border-2 border-destructive" : "border border-muted-foreground"
          }`}
          required
        />
        {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="alternateEmail" className="block text-sm font-medium mb-2">
          Alternate Email (Optional)
        </label>
        <input
          id="alternateEmail"
          type="email"
          name="alternateEmail"
          placeholder="Alternate Email"
          value={formData.alternateEmail}
          onChange={handleInputChange}
          className={`w-full bg-transparent py-3 px-4 placeholder-muted-foreground focus:outline-none transition-colors rounded-md ${
            errors.alternateEmail ? "border-2 border-destructive" : "border border-muted-foreground"
          }`}
        />
        {errors.alternateEmail && <p className="text-destructive text-sm mt-1">{errors.alternateEmail}</p>}
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          className={`w-full bg-transparent py-3 px-4 placeholder-muted-foreground focus:outline-none transition-colors rounded-md ${
            errors.password ? "border-2 border-destructive" : "border border-muted-foreground"
          }`}
          required
        />
        {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
      </div>
      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium mb-2">
          Phone Number
        </label>
        <input
          id="phoneNumber"
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          className={`w-full bg-transparent py-3 px-4 placeholder-muted-foreground focus:outline-none transition-colors rounded-md ${
            errors.phoneNumber ? "border-2 border-destructive" : "border border-muted-foreground"
          }`}
          required
        />
        {errors.phoneNumber && <p className="text-destructive text-sm mt-1">{errors.phoneNumber}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Role</label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleRoleChange("customer")}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              formData.role === "customer"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground hover:bg-muted-foreground"
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange("shop")}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              formData.role === "shop"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground hover:bg-muted-foreground"
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
          {isLoading ? "Creating User..." : "Create User"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/home")}
          className="w-full py-3 rounded border border-foreground hover:bg-muted bg-transparent"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
