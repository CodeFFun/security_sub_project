import { handleGetAllUsers } from "@/lib/actions/admin-action"
import UserTable from "./_components/user-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AdminUsersPage() {
  const res = await handleGetAllUsers()
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold mb-6">Users</h1>
        <Button>
          <Link href="/admin/home/create">
            Create User
          </Link>
          </Button>
      </div>
      {res.success && res.data ? (
        <UserTable users={res.data} />
      ) : (
        <p className="text-destructive">{res.message || "Failed to load users"}</p>
      )}
    </div>
  )
}
