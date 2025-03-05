import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  boolean,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";

// Enums
export const roleEnum = pgEnum("role", ["student", "organizer"]);
export const eventStatusEnum = pgEnum("event_status", [
  "pending",
  "cancelled",
  "approved",
]);
export const eventModeEnum = pgEnum("event_mode", ["offline", "online"]);
export const departmentEnum = pgEnum("department", [
  "computer",
  "extc",
  "it",
  "mechanical",
  "civil",
  "electronics",
]);
export const clubEnum = pgEnum("club", [
  "NSS",
  "GDSC",
  "Algozenith",
  "AI/DL",
  "CSI-COMP",
  "CSI-IT",
  "IEEE",
  "FCRIT Council",
  "ECELL",
  "Manthan",
  "AGNEL CYBER CELL",
  "ECO CLUB",
  "DEBATE CLUB",
  "RHYTHM Club",
  "Agnel Robotics Club",
  "The drama house fcrit",
  "Nritya Nation",
]);
export const eventCategoryEnum = pgEnum("event_category", [
  "technical",
  "cultural",
  "sports",
  "workshop",
  "seminar",
]); // New Enum for event categories

// Users Table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  role: roleEnum("role").notNull(),

  // Student Fields
  rollNo: text("roll_no").unique(),
  department: departmentEnum("department"),
  semester: integer("semester"),
  phoneNo: text("phone_no"),
  collegeEmail: text("college_email"),

  // Organizer Fields
  club: clubEnum("club"), // Required only if role = organizer

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Moderator Table
export const moderators = pgTable("moderators", {
  id: uuid("id").primaryKey().defaultRandom(),
  pin: text("pin").notNull(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Events Table
export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  status: eventStatusEnum("status").default("pending"),
  logo: text("logo"),
  bannerImage: text("bannerImage"),
  organizerId: uuid("organizer_id").references(() => users.id),
  participantRegistration: boolean("participant_registration").default(true),
  category: eventCategoryEnum("category").notNull(), // Now an Enum
  featured: boolean("featured").default(false),
  mode: eventModeEnum("mode"),
  website: text("website"),
  isPaid: boolean("is_paid").default(false),
  price: decimal("price", { precision: 10, scale: 2 }).default("0"),
  qrImage: text("qr_image"),
  dateOfEvent: text("date_of_event"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Event Approval Table
export const eventApprovals = pgTable("event_approvals", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id").references(() => events.id),
  moderatorId: uuid("moderator_id").references(() => moderators.id),
  approvedAt: timestamp("approved_at").defaultNow(),
  isApproved: boolean("is_approved").default(false),
});

// Event Registration Table

export const eventRegistrations = pgTable("event_registrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id").references(() => events.id),
  userId: uuid("user_id").references(() => users.id),
  registeredAt: timestamp("registered_at").defaultNow(),
  paymentStatus: boolean("payment_status"),
  txnId: text("txnid").default(""),
});


// Event Likes Table
export const eventLikes = pgTable("event_likes", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id").references(() => events.id),
  userId: uuid("user_id").references(() => users.id),
  likedAt: timestamp("liked_at").defaultNow(),
});
