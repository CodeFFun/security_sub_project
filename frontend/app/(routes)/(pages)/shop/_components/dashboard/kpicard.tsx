import { TrendingUp} from 'lucide-react'

interface KPICardProps {
  title: string
  value: string
  change: number
  icon: React.ReactNode
}

export default function KPICard({ title, value, change, icon }: KPICardProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
        <div className="text-accent">{icon}</div>
      </div>
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-accent" />
        <span className="text-sm font-medium text-accent">+{change}%</span>
        <span className="text-sm text-muted-foreground">from last month</span>
      </div>
    </div>
  )
}