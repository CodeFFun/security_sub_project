export default function UserEditPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit User</h1>
      <div className="rounded-md border p-6">
        <p className="text-xl">Editing User ID: <span className="font-semibold">{params.id}</span></p>
      </div>
    </div>
  )
}
