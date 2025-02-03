import { relations } from "drizzle-orm";
import { users, events, eventRegistrations } from "./schema";

// Define User Relations
export const usersRelations = relations(users, ({ many }) => ({
  events: many(events, { relationName: "organizer" }),
  eventRegistrations: many(eventRegistrations),
}));

// Define Event Relations
export const eventsRelations = relations(events, ({ one, many }) => ({
  organizer: one(users, {
    fields: [events.organizerId],
    references: [users.id],
    relationName: "organizer",
  }),
  registrations: many(eventRegistrations),
}));

// Define Event Registration Relations
export const eventRegistrationsRelations = relations(
  eventRegistrations,
  ({ one }) => ({
    event: one(events, {
      fields: [eventRegistrations.eventId],
      references: [events.id],
    }),
    user: one(users, {
      fields: [eventRegistrations.userId],
      references: [users.id],
    }),
  })
);
