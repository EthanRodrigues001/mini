"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { eventCategoryEnum, eventModeEnum } from "@/db/schema";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import { createEvent } from "@/actions/event";
import type React from "react";
import { useEvents } from "@/contexts/EventContext";

export function CreateEventDialog() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const { refreshEvents } = useEvents();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: eventCategoryEnum
      .enumValues[0] as (typeof eventCategoryEnum.enumValues)[number],
    mode: eventModeEnum
      .enumValues[0] as (typeof eventModeEnum.enumValues)[number],
    participantRegistration: true,
    isPaid: false,
    price: "",
    website: "",
    dateOfEvent: "",
    logo: undefined,
    bannerImage: undefined,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const validateForm = () => {
    if (formData.name.length < 2) {
      toast.error("Name must be at least 2 characters");
      return false;
    }
    if (formData.description.length < 10) {
      toast.error("Description must be at least 10 characters");
      return false;
    }
    if (!formData.category) {
      toast.error("Please select a category");
      return false;
    }
    if (!formData.mode) {
      toast.error("Please select a mode");
      return false;
    }
    if (!formData.dateOfEvent) {
      toast.error("Please select a date for the event");
      return false;
    }
    if (formData.isPaid && !formData.price) {
      toast.error("Please enter a price for the paid event");
      return false;
    }
    if (formData.website && !formData.website.startsWith("http")) {
      toast.error("Website must be a valid URL");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to create an event");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createEvent(formData, user.id);
      if (result.success) {
        await refreshEvents();
        toast.success("Event Created Successfully");
        setOpen(false);
        setFormData({
          name: "",
          description: "",
          category: eventCategoryEnum.enumValues[0],
          mode: eventModeEnum.enumValues[0],
          participantRegistration: true,
          isPaid: false,
          price: "",
          website: "",
          dateOfEvent: "",
          logo: undefined,
          bannerImage: undefined,
        });
      } else {
        console.log(result.error);
        toast.error(result.error || "Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Fill in the details for your new event. It will be submitted for
            approval.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Event Name
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter event name"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your event"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <Select
                name="category"
                value={formData.category}
                onValueChange={(value: string) =>
                  setFormData((prev) => ({
                    ...prev,
                    category:
                      value as (typeof eventCategoryEnum.enumValues)[number],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {eventCategoryEnum.enumValues.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label
                htmlFor="mode"
                className="block text-sm font-medium text-gray-700"
              >
                Mode
              </label>
              <Select
                name="mode"
                value={formData.mode}
                onValueChange={(value: string) =>
                  setFormData((prev) => ({
                    ...prev,
                    mode: value as (typeof eventModeEnum.enumValues)[number],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  {eventModeEnum.enumValues.map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label
              htmlFor="dateOfEvent"
              className="block text-sm font-medium text-gray-700"
            >
              Date of Event
            </label>
            <Input
              type="date"
              id="dateOfEvent"
              name="dateOfEvent"
              value={formData.dateOfEvent}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <label className="text-base font-medium">
                  Allow Registration
                </label>
                <p className="text-sm text-gray-500">
                  Enable participant registration
                </p>
              </div>
              <Switch
                checked={formData.participantRegistration}
                onCheckedChange={handleSwitchChange("participantRegistration")}
              />
            </div>

            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <label className="text-base font-medium">Paid Event</label>
                <p className="text-sm text-gray-500">Is this a paid event?</p>
              </div>
              <Switch
                checked={formData.isPaid}
                onCheckedChange={handleSwitchChange("isPaid")}
              />
            </div>
          </div>

          {formData.isPaid && (
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price (₹)
              </label>
              <Input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="website"
              className="block text-sm font-medium text-gray-700"
            >
              Website (Optional)
            </label>
            <Input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="logo"
                className="block text-sm font-medium text-gray-700"
              >
                Logo
              </label>
              <Input
                type="file"
                id="logo"
                name="logo"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <div>
              <label
                htmlFor="bannerImage"
                className="block text-sm font-medium text-gray-700"
              >
                Banner Image
              </label>
              <Input
                type="file"
                id="bannerImage"
                name="bannerImage"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Event
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
