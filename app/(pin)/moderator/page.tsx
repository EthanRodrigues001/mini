"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { decryptPin } from "@/actions/pin";
import { PendingEventsTable } from "@/components/moderator/pending-events-table";
import { ApprovalHistoryTable } from "@/components/moderator/approval-history-table";

export default function ModeratorDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("pending");
  const [moderatorId, setModeratorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getModeratorId = async () => {
      try {
        const encryptedPin = localStorage.getItem("portal_pin");

        if (!encryptedPin) {
          router.push("/");
          return;
        }

        const { id } = await decryptPin(encryptedPin);
        setModeratorId(id);
      } catch (error) {
        console.error("Error getting moderator ID:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    getModeratorId();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("portal_pin");
    router.push("/");
  };

  if (loading || !moderatorId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Moderator Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">Pending Events</TabsTrigger>
          <TabsTrigger value="history">Approval History</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="mt-6">
          <PendingEventsTable moderatorId={moderatorId} />
        </TabsContent>
        <TabsContent value="history" className="mt-6">
          <ApprovalHistoryTable moderatorId={moderatorId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
