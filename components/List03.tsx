import React from "react"
import { cn } from "@/lib/utils"
import { Calendar, type LucideIcon, ArrowRight } from "lucide-react"
import { Timer, AlertCircle, CheckCircle2 } from "lucide-react"

interface ListItem {
  id: string
  title: string
  subtitle: string
  icon: LucideIcon
  iconStyle: string
  date: string
  amount?: string
  status: "pending" | "cancelled" | "approved"
  category: string
}

interface List03Props {
  items: ListItem[]
  className?: string
}

const iconStyles = {
  savings: "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100",
  investment: "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100",
  debt: "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100",
}

const statusConfig = {
  pending: {
    icon: Timer,
    class: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  cancelled: {
    icon: AlertCircle,
    class: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  approved: {
    icon: CheckCircle2,
    class: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
}

export function List03({ items, className }: List03Props) {
  return (
    <div className={cn("w-full", className)}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex flex-col",
              "bg-white dark:bg-zinc-900/70",
              "rounded-xl",
              "border border-zinc-100 dark:border-zinc-800",
              "hover:border-zinc-200 dark:hover:border-zinc-700",
              "transition-all duration-200",
              "shadow-sm backdrop-blur-xl",
            )}
          >
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className={cn("p-2 rounded-lg", iconStyles[item.iconStyle as keyof typeof iconStyles])}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div
                  className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1.5",
                    statusConfig[item.status].bg,
                    statusConfig[item.status].class,
                  )}
                >
                  {React.createElement(statusConfig[item.status].icon, {
                    className: "w-3.5 h-3.5",
                  })}
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">{item.title}</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">{item.subtitle}</p>
              </div>

              {item.amount && (
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.amount}</span>
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">price</span>
                </div>
              )}

              <div className="flex items-center text-xs text-zinc-600 dark:text-zinc-400">
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                <span>{item.date}</span>
              </div>

              <div className="text-xs text-zinc-600 dark:text-zinc-400">Category: {item.category}</div>
            </div>

            <div className="mt-auto border-t border-zinc-100 dark:border-zinc-800">
              <button
                className={cn(
                  "w-full flex items-center justify-center gap-2",
                  "py-2.5 px-3",
                  "text-xs font-medium",
                  "text-zinc-600 dark:text-zinc-400",
                  "hover:text-zinc-900 dark:hover:text-zinc-100",
                  "hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
                  "transition-colors duration-200",
                )}
              >
                View Details
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

