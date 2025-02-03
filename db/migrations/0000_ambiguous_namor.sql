CREATE TYPE "public"."club" AS ENUM('NSS', 'GDSC', 'Algozenith', 'AI/DL', 'CSI-COMP', 'CSI-IT', 'IEEE', 'FCRIT Council', 'ECELL', 'Manthan', 'AGNEL CYBER CELL', 'ECO CLUB', 'DEBATE CLUB', 'RHYTHM Club', 'Agnel Robotics Club', 'The drama house fcrit', 'Nritya Nation');--> statement-breakpoint
CREATE TYPE "public"."department" AS ENUM('computer', 'extc', 'it', 'mechanical', 'civil', 'electronics');--> statement-breakpoint
CREATE TYPE "public"."event_category" AS ENUM('technical', 'cultural', 'sports', 'workshop', 'seminar');--> statement-breakpoint
CREATE TYPE "public"."event_mode" AS ENUM('offline', 'online');--> statement-breakpoint
CREATE TYPE "public"."event_status" AS ENUM('pending', 'cancelled', 'approved');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('student', 'organizer');--> statement-breakpoint
CREATE TABLE "event_approvals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid,
	"moderator_id" uuid,
	"approved_at" timestamp DEFAULT now(),
	"is_approved" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "event_registrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid,
	"user_id" uuid,
	"registered_at" timestamp DEFAULT now(),
	"payment_status" boolean
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"status" "event_status" DEFAULT 'pending',
	"organizer_id" uuid,
	"participant_registration" boolean DEFAULT true,
	"category" "event_category" NOT NULL,
	"mode" "event_mode",
	"website" text,
	"is_paid" boolean DEFAULT false,
	"price" numeric(10, 2) DEFAULT '0',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "moderators" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pin" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "moderators_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text,
	"name" text NOT NULL,
	"role" "role" NOT NULL,
	"roll_no" text,
	"department" "department",
	"semester" integer,
	"phone_no" text,
	"college_email" text,
	"club" "club",
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_roll_no_unique" UNIQUE("roll_no")
);
--> statement-breakpoint
ALTER TABLE "event_approvals" ADD CONSTRAINT "event_approvals_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_approvals" ADD CONSTRAINT "event_approvals_moderator_id_moderators_id_fk" FOREIGN KEY ("moderator_id") REFERENCES "public"."moderators"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_organizer_id_users_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;