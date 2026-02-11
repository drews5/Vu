import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-cee2d2a3/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all audition slots
app.get("/make-server-cee2d2a3/auditions", async (c) => {
  try {
    const slots = await kv.getByPrefix("audition:");
    return c.json({ slots: slots || [] });
  } catch (error) {
    console.log("Error fetching auditions:", error);
    return c.json({ error: "Failed to fetch auditions", slots: [] }, 500);
  }
});

// Sign up for an audition slot
app.post("/make-server-cee2d2a3/auditions/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { day, time, name, email } = body;
    
    if (!day || !time || !name) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    
    const key = `audition:${day}:${time}`;
    
    // Check if slot is already taken
    const existing = await kv.get(key);
    if (existing) {
      return c.json({ error: "Slot already taken" }, 409);
    }
    
    // Save the slot
    await kv.set(key, { day, time, name, email: email || '' });
    
    return c.json({ success: true });
  } catch (error) {
    console.log("Error signing up:", error);
    return c.json({ error: "Failed to sign up" }, 500);
  }
});

// Cancel an audition slot
app.post("/make-server-cee2d2a3/auditions/cancel", async (c) => {
  try {
    const body = await c.req.json();
    const { day, time, name } = body;
    
    if (!day || !time || !name) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    
    const key = `audition:${day}:${time}`;
    
    // Check if slot exists and name matches
    const existing = await kv.get(key);
    if (!existing) {
      return c.json({ error: "Slot not found" }, 404);
    }
    
    if (existing.name !== name) {
      return c.json({ error: "Name does not match" }, 403);
    }
    
    // Delete the slot
    await kv.del(key);
    
    return c.json({ success: true });
  } catch (error) {
    console.log("Error canceling:", error);
    return c.json({ error: "Failed to cancel" }, 500);
  }
});

Deno.serve(app.fetch);