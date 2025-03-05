import type {
  roleEnum,
  eventStatusEnum,
  eventModeEnum,
  departmentEnum,
  clubEnum,
  eventCategoryEnum,
} from "@/db/schema";

// User Types
export type User = {
  id: string;
  email: string;
  name: string;
  password: string;
  role: (typeof roleEnum.enumValues)[number];
  rollNo?: string | null;
  department?: (typeof departmentEnum.enumValues)[number] | null;
  semester?: number | null;
  phoneNo?: string | null;
  collegeEmail?: string | null;
  club?: (typeof clubEnum.enumValues)[number] | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserInput = Omit<User, "id" | "createdAt" | "updatedAt">;
export type UpdateUserInput = Partial<
  Omit<User, "id" | "createdAt" | "updatedAt">
>;

// Moderator Types
export type Moderator = {
  id: string;
  pin: string;
  name: string;
  email: string;
  createdAt: Date;
};

export type CreateModeratorInput = Omit<Moderator, "id" | "createdAt">;
export type UpdateModeratorInput = Partial<Omit<Moderator, "id" | "createdAt">>;

// Event Types
export type Event = {
  id: string;
  name: string;
  description: string | null;
  status: (typeof eventStatusEnum.enumValues)[number];
  logo: string | null;
  bannerImage: string | null;
  organizerId: string | null;
  participantRegistration: boolean;
  category: (typeof eventCategoryEnum.enumValues)[number];
  featured: boolean;
  mode: (typeof eventModeEnum.enumValues)[number] | null;
  website: string | null;
  isPaid: boolean;
  price: string;
  qrImage: string | null;
  dateOfEvent: string | null;
  createdAt: Date;
  updatedAt: Date;
};

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
export type EventRegistration = {
  id: string;
  eventId: string;
  userId: string;
  registeredAt: Date;
  paymentStatus: boolean | null;
  txnId: string;
};

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
