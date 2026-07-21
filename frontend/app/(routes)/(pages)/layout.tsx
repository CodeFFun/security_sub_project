
import Navbar from "@/components/navbar";
import { handleGetOrderByUserId } from "@/lib/actions/order-action";
import { handleGetAllSubscriptionOfAUser } from "@/lib/actions/subscription-action";
import { getUserData } from "@/lib/cookie";

export default async function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const role = await getUserData()?.role || "customer";
  const subs = await handleGetAllSubscriptionOfAUser();
  const cart = await handleGetOrderByUserId();
  const subLength = subs?.data?.length || 0;
  const cartLength = cart?.data?.length || 0;

  return (
      <div>
        <Navbar role={role} subs={subLength} cart={cartLength} />
        {children}
      </div>
  );
}
