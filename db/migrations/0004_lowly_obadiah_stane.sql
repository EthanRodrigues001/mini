ALTER TABLE "events" ADD COLUMN "logo" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "banner_images" text[] DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "featured" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "date_of_event" text;