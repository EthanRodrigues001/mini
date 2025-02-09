import { LogOut } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Profile04Props {
  name: string
  role: string
  avatar: string
  email: string
  club: string
  collegeEmail: string
  department: string
  phoneNo: string
  rollNo: string
  semester: number
}

export default function Profile04({
  name,
  role,
  avatar,
  email,
  club,
  collegeEmail,
  department,
  phoneNo,
  rollNo,
  semester,
}: Profile04Props) {
  return (
    <div className="w-full">
      <div
        className="relative p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 
                bg-gradient-to-b from-white to-zinc-50/50 dark:from-zinc-900 dark:to-zinc-900/50"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <Image
                src={avatar || "/placeholder.svg"}
                alt={name}
                width={64}
                height={64}
                className="rounded-xl ring-2 ring-zinc-100 dark:ring-zinc-800"
              />
              <Badge
                variant="secondary"
                className="mt-2 px-2 py-0.5 text-xs font-medium 
                                    bg-gradient-to-r from-amber-100 to-amber-200 
                                    dark:from-amber-900/50 dark:to-amber-800/50 
                                    text-amber-700 dark:text-amber-400
                                    border-amber-200/50 dark:border-amber-800/50"
              >
                {role}
              </Badge>
            </div>
            <div className="space-y-1 overflow-hidden">
              <h2 className="text-lg font-semibold truncate">{name}</h2>
              <p className="text-sm text-zinc-500 truncate">{club}</p>
              <p className="text-sm text-zinc-400 truncate">{email}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <InfoItem label="College Email" value={collegeEmail} />
          <InfoItem label="Department" value={department} />
          <InfoItem label="Phone Number" value={phoneNo} />
          <InfoItem label="Roll Number" value={rollNo} />
          <InfoItem label="Semester" value={semester.toString()} />
        </div>
      </div>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 
                    border border-zinc-200/50 dark:border-zinc-800/50"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{label}</span>
        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{value}</span>
      </div>
    </div>
  )
}

