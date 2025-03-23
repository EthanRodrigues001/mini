"use client";
import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { Calendar } from "lucide-react";
import { CreateEventDialog } from "@/components/CreateEventDialog";
import Profile04 from "@/components/Profile04";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEvents } from "@/contexts/EventContext";
import { List03 } from "@/components/List03";

export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();
  const { events, loading, error } = useEvents();
  const [filter, setFilter] = useState("all");

  const filteredEvents =
    filter === "all"
      ? events
      : events.filter((event) => event.category === filter);

  if (!user) return null;
  if (user.role === "student") {
    router.push(`/`);
    return null;
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <div className="w-[70%] overflow-hidden p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your events and submissions
            </p>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <Select onValueChange={setFilter} defaultValue={filter}>
              <SelectTrigger className="w-[180px] mr-4">
                <SelectValue placeholder="Filter events" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="seminar">Seminar</SelectItem>
              </SelectContent>
            </Select>
            <CreateEventDialog />
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-200px)]">
          {loading ? (
            <p>Loading events...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <List03
              items={filteredEvents.map((event) => ({
                id: event.id,
                title: event.name,
                subtitle: event.description || "",
                icon: Calendar,
                iconStyle: "savings",
                date: event.dateOfEvent || "",
                amount: event.isPaid ? event.price || "" : "Free",
                status: event.status,
                category: event.category,
              }))}
            />
          )}
        </div>
      </div>

      <div className="w-[30%] fixed right-0 top-16 h-[calc(100vh-64px)] overflow-y-auto border-l border-zinc-200 dark:border-zinc-800 bg-background">
        <div className="p-6">
          <Profile04
            name={user.name}
            role={user.role}
            email={user.email}
            avatar={""}
            club={user.club || ""}
            collegeEmail={user.collegeEmail || ""}
            department={user.department || ""}
            phoneNo={user.phoneNo || ""}
            rollNo={user.rollNo || ""}
            semester={user.semester || 0}
          />
        </div>
      </div>
    </div>
  );
}
