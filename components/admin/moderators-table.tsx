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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Eye, Edit, Trash2, Loader2, Plus } from "lucide-react";
import { format } from "date-fns";
import {
  getAllModerators,
  createModerator,
  updateModerator,
  deleteModerator,
  getModeratorApprovalStats,
} from "@/actions/admin";
import type { Moderator } from "@/types";
import { Badge } from "@/components/ui/badge";

type ModeratorWithStats = Moderator & {
  approvalCount?: number;
};

export function ModeratorsTable() {
  const [moderators, setModerators] = useState<ModeratorWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModerator, setSelectedModerator] =
    useState<ModeratorWithStats | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [formError, setFormError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchModerators();
  }, []);

  const fetchModerators = async () => {
    try {
      setLoading(true);

      // Get all moderators
      const result = await getAllModerators();

      if (!result.success || !result.moderators) {
        throw new Error(result.error || "Failed to fetch moderators");
      }

      // Get approval stats
      const statsResult = await getModeratorApprovalStats();

      if (statsResult.success && statsResult.stats) {
        // Merge moderators with their approval stats
        const moderatorsWithStats = result.moderators.map((moderator) => {
          const stats = statsResult.stats.find(
            (s) => s.moderatorId === moderator.id
          );
          return {
            ...moderator,
            approvalCount: stats ? Number(stats.approvalCount) : 0,
          };
        });

        setModerators(moderatorsWithStats);
      } else {
        setModerators(result.moderators);
      }
    } catch (error) {
      console.error("Failed to fetch moderators:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (moderator: ModeratorWithStats) => {
    setSelectedModerator(moderator);
    setIsViewOpen(true);
  };

  const handleEdit = (moderator: ModeratorWithStats) => {
    setSelectedModerator(moderator);
    setName(moderator.name);
    setEmail(moderator.email);
    setPin(""); // Don't show the current PIN for security
    setFormError("");
    setIsEditOpen(true);
  };

  const handleDelete = (moderator: ModeratorWithStats) => {
    setSelectedModerator(moderator);
    setIsDeleteOpen(true);
  };

  const handleAddClick = () => {
    setName("");
    setEmail("");
    setPin("");
    setFormError("");
    setIsAddOpen(true);
  };

  const validateForm = () => {
    if (!name.trim()) {
      setFormError("Name is required");
      return false;
    }

    if (!email.trim()) {
      setFormError("Email is required");
      return false;
    }

    if (!email.includes("@")) {
      setFormError("Invalid email format");
      return false;
    }

    if (pin && (pin.length !== 4 || !/^\d+$/.test(pin))) {
      setFormError("PIN must be 4 digits");
      return false;
    }

    setFormError("");
    return true;
  };

  const handleAddSubmit = async () => {
    if (!validateForm()) return;

    try {
      setActionLoading(true);

      const result = await createModerator({
        name,
        email,
        pin: pin || Math.floor(1000 + Math.random() * 9000).toString(), // Generate random 4-digit PIN if not provided
      });

      if (result.success) {
        await fetchModerators();
        setIsAddOpen(false);
      } else {
        setFormError(result.error || "Failed to create moderator");
      }
    } catch (error) {
      console.error("Error creating moderator:", error);
      setFormError("An unexpected error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedModerator) return;
    if (!validateForm()) return;

    try {
      setActionLoading(true);

      const updateData: any = {
        name,
        email,
      };

      // Only include PIN if it was changed
      if (pin) {
        updateData.pin = pin;
      }

      const result = await updateModerator(selectedModerator.id, updateData);

      if (result.success) {
        await fetchModerators();
        setIsEditOpen(false);
      } else {
        setFormError(result.error || "Failed to update moderator");
      }
    } catch (error) {
      console.error("Error updating moderator:", error);
      setFormError("An unexpected error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedModerator) return;

    try {
      setActionLoading(true);

      const result = await deleteModerator(selectedModerator.id);

      if (result.success) {
        await fetchModerators();
        setIsDeleteOpen(false);
      } else {
        console.error("Failed to delete moderator:", result.error);
      }
    } catch (error) {
      console.error("Error deleting moderator:", error);
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
      <div className="mb-4 flex justify-end">
        <Button onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add Moderator
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>PIN</TableHead>
              <TableHead>Approvals</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {moderators.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No moderators found.
                </TableCell>
              </TableRow>
            ) : (
              moderators.map((moderator) => (
                <TableRow key={moderator.id}>
                  <TableCell className="font-medium">
                    {moderator.name}
                  </TableCell>
                  <TableCell>{moderator.email}</TableCell>
                  <TableCell>••••</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {moderator.approvalCount || 0}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(moderator.createdAt), "MMM dd, yyyy")}
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
                        <DropdownMenuItem onClick={() => handleView(moderator)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(moderator)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(moderator)}
                        >
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

      {/* View Moderator Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Moderator Details</DialogTitle>
          </DialogHeader>
          {selectedModerator && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <div className="mt-1">{selectedModerator.name}</div>
                </div>
                <div>
                  <Label>Email</Label>
                  <div className="mt-1">{selectedModerator.email}</div>
                </div>
                <div>
                  <Label>PIN</Label>
                  <div className="mt-1">{selectedModerator.pin}</div>
                </div>
                <div>
                  <Label>Approvals</Label>
                  <div className="mt-1">
                    <Badge variant="secondary">
                      {selectedModerator.approvalCount || 0}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label>Created At</Label>
                  <div className="mt-1">
                    {format(
                      new Date(selectedModerator.createdAt),
                      "MMM dd, yyyy"
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Moderator Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Moderator</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={actionLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={actionLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-pin">
                PIN (leave blank to keep current)
              </Label>
              <Input
                id="edit-pin"
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) =>
                  setPin(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                placeholder="••••"
                disabled={actionLoading}
              />
            </div>
            {formError && (
              <div className="text-sm text-destructive">{formError}</div>
            )}
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline" disabled={actionLoading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button onClick={handleEditSubmit} disabled={actionLoading}>
                {actionLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Moderator Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Moderator</DialogTitle>
          </DialogHeader>
          {selectedModerator && (
            <div className="grid gap-4 py-4">
              <p>
                Are you sure you want to delete the moderator{" "}
                <strong>{selectedModerator.name}</strong>? This action cannot be
                undone.
              </p>
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline" disabled={actionLoading}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={handleDeleteSubmit}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Moderator Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Moderator</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-name">Name</Label>
              <Input
                id="new-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={actionLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-email">Email</Label>
              <Input
                id="new-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={actionLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-pin">
                PIN (4 digits, leave blank to generate)
              </Label>
              <Input
                id="new-pin"
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) =>
                  setPin(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                placeholder="Enter PIN"
                disabled={actionLoading}
              />
            </div>
            {formError && (
              <div className="text-sm text-destructive">{formError}</div>
            )}
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline" disabled={actionLoading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button onClick={handleAddSubmit} disabled={actionLoading}>
                {actionLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Moderator"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
