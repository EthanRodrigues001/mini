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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, XCircle, Loader2, Calendar } from "lucide-react";
import { getModeratorApprovalHistory } from "@/actions/moderator";
import { format } from "date-fns";

interface ApprovalHistoryTableProps {
  moderatorId: string;
}

type ApprovalHistoryItem = {
  id: string;
  eventId: string;
  moderatorId: string;
  approvedAt: Date;
  isApproved: boolean;
  event: {
    id: string;
    name: string;
    category: string;
    status: string;
    dateOfEvent: string | null;
    mode: string | null;
  };
};

export function ApprovalHistoryTable({
  moderatorId,
}: ApprovalHistoryTableProps) {
  const [history, setHistory] = useState<ApprovalHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ApprovalHistoryItem | null>(
    null
  );
  const [isViewOpen, setIsViewOpen] = useState(false);

  useEffect(() => {
    fetchApprovalHistory();
  }, []);

  const fetchApprovalHistory = async () => {
    try {
      setLoading(true);
      const result = await getModeratorApprovalHistory(moderatorId);
      if (result.success && result.history) {
        setHistory(result.history);
      }
    } catch (error) {
      console.error("Failed to fetch approval history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (item: ApprovalHistoryItem) => {
    setSelectedItem(item);
    setIsViewOpen(true);
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
              <TableHead>Event Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Your Decision</TableHead>
              <TableHead>Current Status</TableHead>
              <TableHead>Reviewed On</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No approval history found.
                </TableCell>
              </TableRow>
            ) : (
              history.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.event.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.event.category}</Badge>
                  </TableCell>
                  <TableCell>
                    {item.isApproved ? (
                      <Badge className="bg-green-500">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Approved
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="mr-1 h-3 w-3" />
                        Rejected
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(item.event.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {format(new Date(item.approvedAt), "MMM dd, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(item)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Approval Details Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approval Details</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Event Name</Label>
                  <div className="mt-1">{selectedItem.event.name}</div>
                </div>
                <div>
                  <Label>Category</Label>
                  <div className="mt-1">
                    <Badge variant="secondary">
                      {selectedItem.event.category}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label>Your Decision</Label>
                  <div className="mt-1">
                    {selectedItem.isApproved ? (
                      <Badge className="bg-green-500">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Approved
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="mr-1 h-3 w-3" />
                        Rejected
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <Label>Current Status</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedItem.event.status)}
                  </div>
                </div>
                <div>
                  <Label>Reviewed On</Label>
                  <div className="mt-1">
                    {format(
                      new Date(selectedItem.approvedAt),
                      "MMM dd, yyyy HH:mm"
                    )}
                  </div>
                </div>
                <div>
                  <Label>Event Date</Label>
                  <div className="mt-1">
                    {selectedItem.event.dateOfEvent || "N/A"}
                  </div>
                </div>
                <div>
                  <Label>Event Mode</Label>
                  <div className="mt-1">{selectedItem.event.mode || "N/A"}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
