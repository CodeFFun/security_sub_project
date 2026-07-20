"use client"

import Link from "next/link"
import { Wrench, Zap, Fan, Droplets, Hammer, ShieldCheck, CalendarClock, BadgeCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

const trades = [
  { icon: Droplets, label: "Plumbing" },
  { icon: Zap, label: "Electrical" },
  { icon: Fan, label: "HVAC" },
  { icon: Hammer, label: "Handyman" },
  { icon: Wrench, label: "Appliance Repair" },
]

const highlights = [
  { icon: BadgeCheck, title: "Vetted professionals", text: "Every provider is verified before they can list services." },
  { icon: CalendarClock, title: "Subscribe & forget", text: "Recurring maintenance plans keep your home serviced on schedule." },
  { icon: ShieldCheck, title: "Secure payments", text: "Pay safely online — only after your booking is confirmed." },
]

export default function HomePage() {
  return (
    <main className="min-h-screen w-full bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,166,35,0.18),transparent_60%)]" />
        <div className="relative max-w-5xl mx-auto px-6 py-24 md:py-32 text-center space-y-6">
          <span className="text-4xl md:text-5xl font-bold tracking-tight">
            Skill<span className="text-accent">Sub</span>
          </span>
          <h1 className="text-2xl md:text-4xl font-semibold leading-tight">
            Trusted skilled professionals, on a subscription that fits your home.
          </h1>
          <p className="text-base md:text-lg opacity-80 max-w-2xl mx-auto">
            Book plumbers, electricians, HVAC techs and more — once, or on a
            recurring maintenance plan you never have to think about again.
          </p>

          <div className="flex gap-4 justify-center max-w-md mx-auto pt-2">
            <Link href="/login" className="flex-1">
              <Button className="w-full bg-accent hover:opacity-90 text-accent-foreground font-semibold px-6 py-3 rounded">
                Login
              </Button>
            </Link>
            <Link href="/register" className="flex-1">
              <Button className="w-full bg-transparent border border-primary-foreground/40 hover:bg-primary-foreground/10 text-primary-foreground font-semibold px-6 py-3 rounded">
                Register
              </Button>
            </Link>
          </div>

          {/* Trade chips */}
          <div className="flex flex-wrap gap-3 justify-center pt-6">
            {trades.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-1.5 text-sm"
              >
                <Icon size={16} className="text-accent" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {highlights.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-xl border border-border bg-card p-6 space-y-3">
            <Icon size={28} className="text-accent" />
            <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{text}</p>
          </div>
        ))}
      </section>
    </main>
  )
}
