import { neon } from "@netlify/neon"
import { desc } from "drizzle-orm"
import { drizzle } from "drizzle-orm/neon-http"
import {
  bookingRequests,
  clientRequests,
  providerOnboarding,
  savedProviders,
} from "../../db/schema"

const db = drizzle(neon())

function json(data: unknown, status = 200) {
  return Response.json(data, { status })
}

async function readJson(req: Request) {
  try {
    return await req.json()
  } catch {
    return null
  }
}

export default async function handler(req: Request) {
  const url = new URL(req.url)
  const resource = url.searchParams.get("resource")

  if (req.method === "GET") {
    if (resource === "bookings") {
      const rows = await db
        .select()
        .from(bookingRequests)
        .orderBy(desc(bookingRequests.createdAt))
        .limit(8)
      return json(rows)
    }

    if (resource === "saved") {
      const rows = await db
        .select()
        .from(savedProviders)
        .orderBy(desc(savedProviders.createdAt))
        .limit(12)
      return json(rows)
    }

    const rows = await db
      .select()
      .from(clientRequests)
      .orderBy(desc(clientRequests.createdAt))
      .limit(8)
    return json(rows)
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405)
  }

  const body = await readJson(req)
  if (!body || typeof body !== "object") {
    return json({ error: "Invalid JSON body" }, 400)
  }

  if (resource === "bookings") {
    const [row] = await db
      .insert(bookingRequests)
      .values(body as typeof bookingRequests.$inferInsert)
      .returning()
    return json(row, 201)
  }

  if (resource === "saved") {
    const [row] = await db
      .insert(savedProviders)
      .values(body as typeof savedProviders.$inferInsert)
      .returning()
    return json(row, 201)
  }

  if (resource === "providers") {
    const [row] = await db
      .insert(providerOnboarding)
      .values(body as typeof providerOnboarding.$inferInsert)
      .returning()
    return json(row, 201)
  }

  const [row] = await db
    .insert(clientRequests)
    .values(body as typeof clientRequests.$inferInsert)
    .returning()
  return json(row, 201)
}

export const config = {
  path: "/api/marketplace",
}
