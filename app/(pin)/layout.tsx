"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { decryptPin } from "@/actions/pin";
import { Loader2 } from "lucide-react";

export default function PinLayout({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const encryptedPin = localStorage.getItem("portal_pin");

        if (!encryptedPin) {
          setIsAuthorized(false);
          router.push("/");
          return;
        }

        const { pin, type } = await decryptPin(encryptedPin);

        // Check if the current path matches the user type
        const path = window.location.pathname;
        const isAdminPath = path.startsWith("/pin/admin");
        const isModeratorPath = path.startsWith("/pin/moderator");

        if (
          (isAdminPath && type !== "admin") ||
          (isModeratorPath && type !== "moderator")
        ) {
          setIsAuthorized(false);
          router.push("/");
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Authentication error:", error);
        setIsAuthorized(false);
        router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  if (isAuthorized === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isAuthorized === false) {
    return null;
  }

  return <>{children}</>;
}
