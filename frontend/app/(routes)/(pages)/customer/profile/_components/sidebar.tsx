"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  User,
  Pencil,
  Bell,
  CreditCard,
  ChevronRight,
  CircleDollarSign
} from "lucide-react"

// Object structure where key is first sidebar item and values are second sidebar items
const sidebarItems: Record<string, { label: string; icon: React.ElementType }[]> = {
  Profile: [
    { label: "My Profile", icon: Pencil },
    { label: "Notification", icon: Bell },
  ],
  Orders: [
    { label: "My Orders", icon: CreditCard },
    { label: "My Subscriptions", icon: CircleDollarSign },
  ],
}

const mainSidebarIcons: Record<string, React.ElementType> = {
  Dashboard: LayoutDashboard,
  Profile: User,
  Orders: CreditCard,
}

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [activeMainItem, setActiveMainItem] = useState<string>("Profile")

  const handleMainItemClick = (item: string) => {
    setActiveMainItem(item)
    const subItems = sidebarItems[item]
    if (subItems && subItems.length > 0) {
      setActiveTab(subItems[0].label)
    }
  }

  const subItems = sidebarItems[activeMainItem] || []

  return (
    <aside className="flex">
      <div className="w-48 border-r border-border p-6">
        <nav className="space-y-2">
          {Object.keys(sidebarItems).map((item) => {
            const Icon = mainSidebarIcons[item]
            return (
              <button
                key={item}
                onClick={() => handleMainItemClick(item)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeMainItem === item
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {Icon && <Icon size={18} />}
                {item}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Second Sidebar - Sub Navigation */}
      {subItems.length > 0 && (
        <div className="w-55 border-r border-border py-6 px-5">
          <nav className="space-y-2 mt-5">
            {subItems.map((subItem) => {
              const Icon = subItem.icon
              return (
                <button
                  key={subItem.label}
                  onClick={() => setActiveTab(subItem.label)}
                  className={`w-full flex items-center justify-between gap-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === subItem.label
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    {subItem.label}
                  </div>
                  {activeTab === subItem.label && (
                    <ChevronRight size={16} className="text-muted-foreground" />
                  )}
                </button>
              )
            })}
          </nav>
        </div>
      )}
    </aside>
  )
}
