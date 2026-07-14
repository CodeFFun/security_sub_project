"use client"

import {  Heart, ShoppingCart, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "./theme-toggle"

export default function Navbar({role, subs, cart}:{role:string, subs: number, cart: number}) {
  const pathname = usePathname()
  console.log(pathname.split("/")[1])

  const isAuthPage =
    pathname.startsWith("/(auth)") ||
    pathname.includes("/login") ||
    pathname.includes("/register") ||
    pathname.includes("/forgot-password") 

  return (
    <nav className="border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          <Link href={`/${pathname.split("/")[1]}/home`} className="shrink-0">
            <span className="text-2xl font-bold tracking-tight text-primary dark:text-foreground">Skill<span className="text-accent">Sub</span></span>
          </Link>

          {!isAuthPage && (
            <>

              <div className="flex items-center gap-6">
                <div className={`flex gap-6 ${pathname.split("/")[1] === "shop" ? "hidden" : ""}`}>
                <Link href="/customer/subscription" className={`relative hover:opacity-70 transition-opacity `}>
                  <Heart size={24} className="text-foreground" />
                  <span className={`absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${subs === 0 ? 'hidden' : ''}`}>
                    {subs}
                  </span>
                </Link>

                <Link href="/customer/cart" className={`relative hover:opacity-70 transition-opacity`}>
                  <ShoppingCart size={24} className="text-foreground" />
                  <span className={`absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${cart === 0 ? 'hidden' : ''}`}>
                    {cart}
                  </span>
                </Link>
                </div>

                <Link href={`/${pathname.split("/")[1]}/profile`} className="hover:opacity-70 transition-opacity">
                  <User size={24} className="text-foreground" />
                </Link>
                
                <div className="w-px h-6 bg-border"></div>
                
                <ThemeToggle />
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
