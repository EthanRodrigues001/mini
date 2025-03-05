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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import {
  getPendingEvents,
  approveEvent,
  rejectEvent,
} from "@/actions/moderator";
import type { EventWithApprovals } from "@/types";

interface PendingEventsTableProps {
  moderatorId: string;
}

export function PendingEventsTable({ moderatorId }: PendingEventsTableProps) {
  const [events, setEvents] = useState<EventWithApprovals[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EventWithApprovals | null>(
    null
  );
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isConfirmApproveOpen, setIsConfirmApproveOpen] = useState(false);
  const [isConfirmRejectOpen, setIsConfirmRejectOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const fetchPendingEvents = async () => {
    try {
      setLoading(true);
      const result = await getPendingEvents(moderatorId);
      if (result.success && result.events) {
        setEvents(result.events);
      }
    } catch (error) {
      console.error("Failed to fetch pending events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (event: EventWithApprovals) => {
    setSelectedEvent(event);
    setIsViewOpen(true);
  };

  const handleApproveClick = (event: EventWithApprovals) => {
    setSelectedEvent(event);
    setIsConfirmApproveOpen(true);
  };

  const handleRejectClick = (event: EventWithApprovals) => {
    setSelectedEvent(event);
    setIsConfirmRejectOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedEvent) return;

    try {
      setActionLoading(true);
      const result = await approveEvent(selectedEvent.id, moderatorId);

      if (result.success) {
        await fetchPendingEvents();
        setIsConfirmApproveOpen(false);
      }
    } catch (error) {
      console.error("Failed to approve event:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedEvent) return;

    try {
      setActionLoading(true);
      const result = await rejectEvent(selectedEvent.id, moderatorId);

      if (result.success) {
        await fetchPendingEvents();
        setIsConfirmRejectOpen(false);
      }
    } catch (error) {
      console.error("Failed to reject event:", error);
    } finally {
      setActionLoading(false);
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
              <TableHead>Date</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Approval Status</TableHead>
              <TableHead className="w-[200px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No pending events found.
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{event.category}</Badge>
                  </TableCell>
                  <TableCell>{event.dateOfEvent || "N/A"}</TableCell>
                  <TableCell>{event.mode || "N/A"}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>
                          {event.approvals} of {event.totalModerators} approvals
                        </span>
                        <span>
                          {Math.round(
                            (event.approvals / event.totalModerators) * 100
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={(event.approvals / event.totalModerators) * 100}
                        className="h-2"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(event)}
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Button>
                      {!event.isApprovedByCurrentModerator ? (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApproveClick(event)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRejectClick(event)}
                          >
                            <XCircle className="mr-1 h-4 w-4" />
                            Reject
                          </Button>
                        </>
                      ) : (
                        <Badge
                          variant="outline"
                          className="ml-2 bg-green-50 text-green-700"
                        >
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Approved
                        </Badge>
                      )}
                    </div>
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
                  <Label>Mode</Label>
                  <div className="mt-1">{selectedEvent.mode || "N/A"}</div>
                </div>
                <div>
                  <Label>Date</Label>
                  <div className="mt-1">
                    {selectedEvent.dateOfEvent || "N/A"}
                  </div>
                </div>
                <div>
                  <Label>Price</Label>
                  <div className="mt-1">
                    {selectedEvent.isPaid ? `₹${selectedEvent.price}` : "Free"}
                  </div>
                </div>
                <div>
                  <Label>Website</Label>
                  <div className="mt-1">
                    {selectedEvent.website ? (
                      <a
                        href={selectedEvent.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {selectedEvent.website}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </div>
                </div>
                <div className="col-span-2">
                  <Label>Description</Label>
                  <div className="mt-1">
                    {selectedEvent.description || "No description provided."}
                  </div>
                </div>
                <div className="col-span-2">
                  <Label>Approval Status</Label>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>
                        {selectedEvent.approvals} of{" "}
                        {selectedEvent.totalModerators} approvals
                      </span>
                      <span>
                        {Math.round(
                          (selectedEvent.approvals /
                            selectedEvent.totalModerators) *
                            100
                        )}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        (selectedEvent.approvals /
                          selectedEvent.totalModerators) *
                        100
                      }
                      className="h-2 mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Approve Dialog */}
      <Dialog
        open={isConfirmApproveOpen}
        onOpenChange={setIsConfirmApproveOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Event</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <p>
                  Are you sure you want to approve{" "}
                  <strong>{selectedEvent.name}</strong>?
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline" disabled={actionLoading}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Reject Dialog */}
      <Dialog open={isConfirmRejectOpen} onOpenChange={setIsConfirmRejectOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Event</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <p>
                  Are you sure you want to reject{" "}
                  <strong>{selectedEvent.name}</strong>?
                  <br />
                  <span className="text-sm text-muted-foreground">
                    This will immediately cancel the event and cannot be undone.
                  </span>
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline" disabled={actionLoading}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
