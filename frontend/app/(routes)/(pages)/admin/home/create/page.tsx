"use client"

import { UserCreateForm } from "../_components/user-create-form"

export default function CreateUserPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create New User</h1>
        <UserCreateForm />
      </div>
    </div>
  )
}
