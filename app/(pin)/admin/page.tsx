"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { UsersTable } from "@/components/admin/users-table";
import { ModeratorsTable } from "@/components/admin/moderators-table";
import { EventsTable } from "@/components/admin/events-table";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("users");

  const handleLogout = () => {
    localStorage.removeItem("portal_pin");
    router.push("/");
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="moderators">Moderators</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="mt-6">
          <UsersTable />
        </TabsContent>
        <TabsContent value="moderators" className="mt-6">
          <ModeratorsTable />
        </TabsContent>
        <TabsContent value="events" className="mt-6">
          <EventsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
