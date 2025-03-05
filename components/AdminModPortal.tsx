"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { adminLogin, moderatorLogin } from "@/actions/auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function AdminModPortal() {
  const [pin, setPin] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isAdmin) {
        const result = await adminLogin(pin)
        if (result.success) {
          toast.success("Admin login successful")
          router.push("/admin/dashboard")
        } else {
          toast.error(result.error || "Admin login failed")
        }
      } else {
        const result = await moderatorLogin(pin)
        if (result.success) {
          toast.success("Moderator login successful")
          router.push("/moderator/dashboard")
        } else {
          toast.error(result.error || "Moderator login failed")
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="absolute left-4 bottom-4">
          Portal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isAdmin ? "Admin" : "Moderator"} Login</DialogTitle>
          <DialogDescription>
            Enter your 4-digit PIN to access the {isAdmin ? "admin" : "moderator"} portal.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pin">PIN</Label>
            <Input
              id="pin"
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        <Button variant="link" onClick={() => setIsAdmin(!isAdmin)} className="w-full">
          Switch to {isAdmin ? "Moderator" : "Admin"} Login
        </Button>
      </DialogContent>
    </Dialog>
  )
}

