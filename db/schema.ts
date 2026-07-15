import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

export const savedProviders = pgTable("saved_providers", {
  id: serial().primaryKey(),
  providerId: text("provider_id").notNull(),
  providerName: text("provider_name").notNull(),
  service: text().notNull(),
  area: text().notNull(),
  hourlyRate: integer("hourly_rate").notNull(),
  verified: boolean().notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
})

export const bookingRequests = pgTable("booking_requests", {
  id: serial().primaryKey(),
  providerId: text("provider_id").notNull(),
  providerName: text("provider_name").notNull(),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  serviceDate: text("service_date").notNull(),
  serviceTime: text("service_time").notNull(),
  addressArea: text("address_area").notNull(),
  details: text().notNull(),
  budget: integer(),
  status: text().notNull().default("Pending review"),
  createdAt: timestamp("created_at").defaultNow(),
})

export const clientRequests = pgTable("client_requests", {
  id: serial().primaryKey(),
  title: text().notNull(),
  category: text().notNull(),
  area: text().notNull(),
  budget: integer().notNull(),
  timeframe: text().notNull(),
  description: text().notNull(),
  status: text().notNull().default("Open"),
  createdAt: timestamp("created_at").defaultNow(),
})

export const providerOnboarding = pgTable("provider_onboarding", {
  id: serial().primaryKey(),
  fullName: text("full_name").notNull(),
  email: text().notNull(),
  service: text().notNull(),
  category: text().notNull(),
  area: text().notNull(),
  hourlyRate: integer("hourly_rate").notNull(),
  experience: text().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})
