import type {
  roleEnum,
  eventStatusEnum,
  eventModeEnum,
  departmentEnum,
  clubEnum,
  eventCategoryEnum,
} from "@/db/schema";

// User Types
export type Role = (typeof roleEnum.enumValues)[number];
export type Department = (typeof departmentEnum.enumValues)[number];
export type Club = (typeof clubEnum.enumValues)[number];

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: Role;
  rollNo?: string;
  department?: Department;
  semester?: number;
  phoneNo?: string;
  collegeEmail?: string;
  club?: Club;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateUserInput = Omit<User, "id" | "createdAt" | "updatedAt">;
export type UpdateUserInput = Partial<
  Omit<User, "id" | "createdAt" | "updatedAt">
>;

// Moderator Types
export interface Moderator {
  id: string;
  pin: string;
  name: string;
  email: string;
  createdAt: Date;
}

export type CreateModeratorInput = Omit<Moderator, "id" | "createdAt">;
export type UpdateModeratorInput = Partial<Omit<Moderator, "id" | "createdAt">>;

// Event Types
export type EventStatus = (typeof eventStatusEnum.enumValues)[number];
export type EventMode = (typeof eventModeEnum.enumValues)[number];
export type EventCategory = (typeof eventCategoryEnum.enumValues)[number];

export interface Event {
  id: string;
  name: string;
  description?: string;
  status: EventStatus;
  logo?: string;
  bannerImage?: string;
  organizerId: string;
  participantRegistration: boolean;
  category: EventCategory;
  featured: boolean;
  mode?: EventMode;
  website?: string;
  isPaid: boolean;
  price: number | string;
  qrImage?: string;
  dateOfEvent?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateEventInput = Omit<
  Event,
  "id" | "createdAt" | "updatedAt" | "status" | "featured"
>;
export type UpdateEventInput = Partial<
  Omit<Event, "id" | "createdAt" | "updatedAt">
>;

// Event Approval Types
export type EventApproval = {
  id: string;
  eventId: string;
  moderatorId: string;
  approvedAt: Date;
  isApproved: boolean;
};

export type CreateEventApprovalInput = Omit<EventApproval, "id" | "approvedAt">;

// Event Registration Types
export interface EventRegistration {
  id: string;
  eventId: string | null;
  userId: string | null;
  registeredAt: Date | null;
  paymentStatus: boolean | null;
  txnId: string | null;
}

// Event Like Types
export type EventLike = {
  id: string;
  eventId: string;
  userId: string;
  likedAt: Date;
};

// Event with additional information
export type EventWithApprovals = Event & {
  approvals: number;
  totalModerators: number;
  isApprovedByCurrentModerator: boolean;
};

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

export interface EventResponse extends ApiResponse {
  event?: Event;
}

export interface EventLikeResponse extends ApiResponse {
  liked?: boolean;
  count?: number;
}

export interface EventRegistrationResponse extends ApiResponse {
  registration?: EventRegistration;
}

export interface PaymentVerificationResponse extends ApiResponse {
  isDuplicate?: boolean;
}
