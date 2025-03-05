"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Event = {
  id: string;
  name: string;
  description: string;
  status: "pending" | "approved" | "cancelled";
  category: string;
  mode: "online" | "offline";
  dateOfEvent: string;
  organizerId: string;
  isPaid: boolean;
  price: string;
  featured: boolean;
};

export function EventsTable() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    // Mock data for now - would be replaced with actual API call
    const mockEvents: Event[] = [
      {
        id: "1",
        name: "Tech Conference 2023",
        description: "Annual technology conference",
        status: "approved",
        category: "technical",
        mode: "offline",
        dateOfEvent: "2023-12-15",
        organizerId: "org1",
        isPaid: true,
        price: "500",
        featured: true,
      },
      {
        id: "2",
        name: "Cultural Fest",
        description: "Annual cultural festival",
        status: "pending",
        category: "cultural",
        mode: "offline",
        dateOfEvent: "2023-11-20",
        organizerId: "org2",
        isPaid: false,
        price: "0",
        featured: false,
      },
      {
        id: "3",
        name: "Coding Workshop",
        description: "Learn to code in Python",
        status: "cancelled",
        category: "workshop",
        mode: "online",
        dateOfEvent: "2023-10-05",
        organizerId: "org1",
        isPaid: true,
        price: "200",
        featured: false,
      },
    ];

    setEvents(mockEvents);
    setLoading(false);
  }, []);

  const handleView = (event: Event) => {
    setSelectedEvent(event);
    setIsViewOpen(true);
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsEditOpen(true);
  };

  const handleDelete = (event: Event) => {
    setSelectedEvent(event);
    setIsDeleteOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600">
            Pending
          </Badge>
        );
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No events found.
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{event.category}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(event.status)}</TableCell>
                  <TableCell>{event.mode}</TableCell>
                  <TableCell>{event.dateOfEvent}</TableCell>
                  <TableCell>
                    {event.isPaid ? `₹${event.price}` : "Free"}
                  </TableCell>
                  <TableCell>
                    {event.featured ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(event)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(event)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(event)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Event Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <div className="mt-1">{selectedEvent.name}</div>
                </div>
                <div>
                  <Label>Category</Label>
                  <div className="mt-1">
                    <Badge variant="secondary">{selectedEvent.category}</Badge>
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedEvent.status)}
                  </div>
                </div>
                <div>
                  <Label>Mode</Label>
                  <div className="mt-1">{selectedEvent.mode}</div>
                </div>
                <div>
                  <Label>Date</Label>
                  <div className="mt-1">{selectedEvent.dateOfEvent}</div>
                </div>
                <div>
                  <Label>Price</Label>
                  <div className="mt-1">
                    {selectedEvent.isPaid ? `₹${selectedEvent.price}` : "Free"}
                  </div>
                </div>
                <div>
                  <Label>Featured</Label>
                  <div className="mt-1">
                    {selectedEvent.featured ? "Yes" : "No"}
                  </div>
                </div>
                <div className="col-span-2">
                  <Label>Description</Label>
                  <div className="mt-1">{selectedEvent.description}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog - Placeholder for now */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="grid gap-4 py-4">
              <p>Edit event functionality would be implemented here.</p>
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Event Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="grid gap-4 py-4">
              <p>
                Are you sure you want to delete the event{" "}
                <strong>{selectedEvent.name}</strong>? This action cannot be
                undone.
              </p>
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button variant="destructive">Delete</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
