import { getUserData } from "@/lib/cookie"
import ProfilePage from "../_components/profile-page";

export default async function Page(){

    const user = await getUserData();

  return (
    <ProfilePage user={user} />
  )
}