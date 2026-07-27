"use server"

import { handleGetUserById } from "@/lib/actions/admin-action"
import { MainContent } from "../_components/mainbar";

export default async function UserDetailPage({ params }: { params: { id: string } }) {
  const {id} = await params;
  const res = await handleGetUserById(id)
  console.log(res)

  return(
    <MainContent user={res.success && res.data ? res.data : null} userId={id}/>
  )
}
