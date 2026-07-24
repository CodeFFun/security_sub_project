"use client"

import {useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { clearAuthCookies } from "@/lib/cookie"
import { BASE_URL } from "@/lib/api/axios"
import Image from "next/image"
import { toast } from "sonner"
import { handleUpdateUser } from "@/lib/actions/user-action"

export function Profile({user}:{user: any}) {
  const [profilePicture, setProfilePicture] = useState<File | null>(null)

  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    firstName: user?.fullName?.split(" ")[0] || "",
    lastName: user?.fullName?.split(" ")[1] || "",
    alternateEmail: user?.alternateEmail || "",
    phoneNumber: user?.phoneNumber || "",
    profilePictureUrl: user?.profilePictureUrl || "",
    newPassword: "",
  })

  const router = useRouter()


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null
    if (file) {
        setProfilePicture(file)
        const imageUrl = URL.createObjectURL(file)
        setProfileData((prev) => ({
            ...prev,
            profilePictureUrl: imageUrl,
        }))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRevertChanges = () => {
    setProfileData({
      username: user?.username || "",
        firstName: user?.fullname?.split(" ")[0] || "",
        lastName: user?.fullname?.split(" ")[1] || "",
        alternateEmail: user?.alternateEmail || "",
        phoneNumber: user?.phoneNumber || "",
        profilePictureUrl: user?.profilePictureUrl || "",
        newPassword: "",
    })
    setProfilePicture(null)
  }

  const handleSaveProfile = async () => {
  const changedFields: Record<string, any> = {}

  const fieldChanges = [
    {key: "fullName", current: `${profileData.firstName} ${profileData.lastName}`, original: user.fullname},
    { key: "alternateEmail", current: profileData.alternateEmail, original: user.alternateEmail },
    { key: "phoneNumber", current: profileData.phoneNumber, original: user.phoneNumber },
  ]

  fieldChanges.forEach(({ key, current, original }) => {
    if (current !== original && current.trim() !== "") {
      changedFields[key] = current
    }
  })

  // Add password if provided
  if (profileData.newPassword !== "") {
    changedFields.newPassword = profileData.newPassword
  }

  // Handle profile picture separately
  const formData = new FormData()
  Object.entries(changedFields).forEach(([key, value]) => {
    if (key !== "profilePictureUrl") {
    formData.append(key, value)
  }
  })
  if (profilePicture) {
    formData.append("profilePictureUrl", profilePicture)
  }
  if(Object.keys(changedFields).length === 0 && !profilePicture){
    toast.error("No changes to update.")
    return;
  }

  try {
    const res = await handleUpdateUser(formData)
    if (res.success) {
      toast.success("Profile updated successfully!")
      router.refresh()
    }
  } catch (error: any) {
    toast.error(error.message || "Failed to update profile")
  }
    router.refresh()
    }

  const handleLogout = async () => {
    await clearAuthCookies()
    router.push("/login")
  }

  return (
    <main className="flex-1 p-8">
      <div className="w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Hello {profileData.username}!</h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-destructive border-destructive hover:bg-destructive/10"
          >
            Logout
          </Button>
        </div>

        {/* Profile Image Section */}
        <div className="bg-card rounded-lg p-6 mb-8 border border-border">
          <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-secondary rounded-full shrink-0">
              {profileData.profilePictureUrl && (
                <Image
                  unoptimized
                  loader={({ src }) => src}
                  src={profileData.profilePictureUrl.startsWith("blob:") ? profileData.profilePictureUrl : `${BASE_URL}${profileData.profilePictureUrl}`}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover overflow-hidden"
                    width={0}
                    height={0}
                />
              )}
            </div>
            <div>
              <div className="flex gap-2">
                <Button className="bg-primary text-primary-foreground hover:opacity-90" onClick={() => document.getElementById('profilePictureInput')?.click()}>
                  <input
                    type="file"
                    id="profilePictureInput"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  + Change Image
                </Button>
                <Button variant="outline" className="text-muted-foreground border-border" onClick={() => setProfileData((prev) => ({ ...prev, profilePictureUrl: "" }))}>
                  Remove Image
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg p-6 mb-8 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-6">Personal Information</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={profileData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={profileData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-6">Account Security</h2>
          <div className="mb-6">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Alternate Email
            </label>
            <input
              type="email"
              name="alternateEmail"
              value={profileData.alternateEmail}
              onChange={handleInputChange}
              placeholder="Enter alternate email"
              className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={profileData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="border-t border-border pt-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Password</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={profileData.newPassword}
                onChange={handleInputChange}
                placeholder="••••••••••"
                className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-6">
            <Button
              onClick={handleSaveProfile}
              className="bg-primary text-primary-foreground hover:opacity-90"
            >
              Save Profile
            </Button>
            <Button
              onClick={handleRevertChanges}
              className="bg-destructive text-destructive-foreground hover:opacity-90"
            >
              Revert Changes
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
