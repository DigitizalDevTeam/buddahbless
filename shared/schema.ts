import { sql } from "drizzle-orm";
import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash"),
  google_id: text("google_id").unique(),
  name: text("name").notNull().default(""),
  avatar_url: text("avatar_url"),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  user_id: text("user_id"),
  stripe_session_id: text("stripe_session_id").notNull().unique(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  postalCode: text("postalCode").notNull(),
  country: text("country").notNull(),
  total: integer("total").notNull(),
  status: text("status").notNull().default("paid"),
  created_at: text("created_at").notNull(),
});

export const order_items = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  order_id: text("order_id").notNull(),
  name: text("name").notNull(),
  price: text("price").notNull(),
  image: text("image"),
  quantity: integer("quantity").notNull(),
  size: text("size"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password_hash: true,
  google_id: true,
  name: true,
  avatar_url: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof order_items.$inferSelect;

/** Safe user shape returned by API (no password_hash) */
export type SafeUser = Pick<User, "id" | "email" | "name" | "avatar_url">;

/** Order with items for API responses */
export type OrderWithItems = Order & { items: OrderItem[] };

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
