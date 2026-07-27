import Link from "next/link"

interface User {
  _id: string
  email: string
  username: string
  role: string
}

interface UserTableProps {
  users: User[]
}

export default function UserTable({ users }: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-secondary">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Username
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-card divide-y divide-border">
          {users.map((user) => (
            <tr key={user._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                {user.username}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                {user.role}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <Link
                  href={`/admin/home/${user._id}`}
                  className="text-accent hover:opacity-70 hover:underline"
                >
                  Visit Profile
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
