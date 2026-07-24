"use client"

import { useState } from "react"
import { Sidebar } from "./_components/sidebar"
import { Profile } from "./_components/profilepage"
import { NotificationMainbar } from "./_components/notification-mainbar"
import SubTabPage from "../_components/subs/sub-tab-page"
import MyOrderPage from "../_components/cart/my-order-page"

export default function ProfilePage({user}:{user: any}) {
  const [activeTab, setActiveTab] = useState("My Profile")

  return (
    <div className="flex min-h-screen bg-secondary">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "My Profile" && <Profile user={user} />}
      {activeTab === "Notification" && <NotificationMainbar />}
      {activeTab === "My Subscriptions" && <SubTabPage />}
      {activeTab === "My Orders" && <MyOrderPage />}
    </div>
  )
}
