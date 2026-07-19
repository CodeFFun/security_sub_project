import { Wrench, Zap, CalendarClock } from "lucide-react"
import { LoginForm } from "../_components/login-form"

export default function LoginPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      <div className="hidden lg:flex flex-col justify-center gap-8 p-16 bg-primary text-primary-foreground">
        <span className="text-4xl font-bold tracking-tight">
          Skill<span className="text-accent">Sub</span>
        </span>
        <p className="text-xl leading-relaxed opacity-90 max-w-md">
          Your home, maintained by trusted professionals — on your schedule,
          every time.
        </p>
        <ul className="space-y-4 text-sm opacity-80">
          <li className="flex items-center gap-3">
            <Wrench size={18} className="text-accent" /> Plumbing, electrical, HVAC & more
          </li>
          <li className="flex items-center gap-3">
            <CalendarClock size={18} className="text-accent" /> Recurring maintenance plans
          </li>
          <li className="flex items-center gap-3">
            <Zap size={18} className="text-accent" /> Book in minutes, pay securely
          </li>
        </ul>
      </div>
      <div className="flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Log in to SkillSub</h2>
            <p className="text-muted-foreground">Book trusted professionals in minutes</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
