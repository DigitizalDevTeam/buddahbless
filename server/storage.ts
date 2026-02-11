import { type User, type InsertUser, type Order, type OrderItem } from "@shared/schema";
import { users, orders, order_items } from "@shared/schema";
import { randomUUID } from "crypto";
import { eq, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

export type OrderInsert = Pick<Order, "user_id" | "stripe_session_id" | "email" | "total" | "status" | "created_at">;
export type OrderItemInsert = Pick<OrderItem, "order_id" | "name" | "price" | "image" | "quantity" | "size">;

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createOrder(order: OrderInsert, items: Omit<OrderItemInsert, "order_id">[]): Promise<Order & { items: OrderItem[] }>;
  getOrdersByUserId(userId: string): Promise<(Order & { items: OrderItem[] })[]>;
  getOrderBySessionId(sessionId: string): Promise<(Order & { items: OrderItem[] }) | undefined>;
  getOrderById(orderId: string): Promise<(Order & { items: OrderItem[] }) | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private orders: Map<string, Order>;
  private orderItems: Map<string, OrderItem[]>;

  constructor() {
    this.users = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const normalized = email.trim().toLowerCase();
    return Array.from(this.users.values()).find(
      (u) => u.email.trim().toLowerCase() === normalized
    );
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (u) => u.google_id === googleId
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      email: insertUser.email,
      password_hash: insertUser.password_hash ?? null,
      google_id: insertUser.google_id ?? null,
      name: insertUser.name ?? "",
      avatar_url: insertUser.avatar_url ?? null,
    };
    this.users.set(id, user);
    return user;
  }

  async createOrder(orderInsert: OrderInsert, itemRows: Omit<OrderItemInsert, "order_id">[]): Promise<Order & { items: OrderItem[] }> {
    const id = randomUUID();
    const order: Order = {
      id,
      user_id: orderInsert.user_id ?? null,
      stripe_session_id: orderInsert.stripe_session_id,
      email: orderInsert.email,
      total: orderInsert.total,
      status: orderInsert.status,
      created_at: orderInsert.created_at,
    };
    this.orders.set(id, order);
    const items: OrderItem[] = itemRows.map((row) => ({
      id: randomUUID(),
      order_id: id,
      name: row.name,
      price: row.price,
      image: row.image ?? null,
      quantity: row.quantity,
      size: row.size ?? null,
    }));
    this.orderItems.set(id, items);
    return { ...order, items };
  }

  async getOrdersByUserId(userId: string): Promise<(Order & { items: OrderItem[] })[]> {
    const list = Array.from(this.orders.values()).filter((o) => o.user_id === userId);
    return list
      .map((o) => ({
        ...o,
        items: this.orderItems.get(o.id) ?? [],
      }))
      .sort((a, b) => (b.created_at > a.created_at ? 1 : -1));
  }

  async getOrderBySessionId(sessionId: string): Promise<(Order & { items: OrderItem[] }) | undefined> {
    const order = Array.from(this.orders.values()).find((o) => o.stripe_session_id === sessionId);
    if (!order) return undefined;
    const items = this.orderItems.get(order.id) ?? [];
    return { ...order, items };
  }

  async getOrderById(orderId: string): Promise<(Order & { items: OrderItem[] }) | undefined> {
    const order = this.orders.get(orderId);
    if (!order) return undefined;
    const items = this.orderItems.get(order.id) ?? [];
    return { ...order, items };
  }
}

type DrizzleDB = ReturnType<typeof drizzle>;

export class DrizzleStorage implements IStorage {
  constructor(private db: DrizzleDB) {}

  async getUser(id: string): Promise<User | undefined> {
    const rows = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return rows[0] ?? undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const normalized = email.trim().toLowerCase();
    const rows = await this.db
      .select()
      .from(users)
      .where(sql`lower(trim(${users.email})) = ${normalized}`)
      .limit(1);
    return rows[0] ?? undefined;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const rows = await this.db.select().from(users).where(eq(users.google_id, googleId)).limit(1);
    return rows[0] ?? undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await this.db
      .insert(users)
      .values({
        email: insertUser.email,
        password_hash: insertUser.password_hash ?? null,
        google_id: insertUser.google_id ?? null,
        name: insertUser.name ?? "",
        avatar_url: insertUser.avatar_url ?? null,
      })
      .returning();
    if (!user) throw new Error("createUser: no row returned");
    return user;
  }

  async createOrder(orderInsert: OrderInsert, itemRows: Omit<OrderItemInsert, "order_id">[]): Promise<Order & { items: OrderItem[] }> {
    const [order] = await this.db
      .insert(orders)
      .values({
        user_id: orderInsert.user_id ?? null,
        stripe_session_id: orderInsert.stripe_session_id,
        email: orderInsert.email,
        total: orderInsert.total,
        status: orderInsert.status,
        created_at: orderInsert.created_at,
      })
      .returning();
    if (!order) throw new Error("createOrder: no row returned");
    const items: OrderItem[] = [];
    for (const row of itemRows) {
      const [item] = await this.db
        .insert(order_items)
        .values({
          order_id: order.id,
          name: row.name,
          price: row.price,
          image: row.image ?? null,
          quantity: row.quantity,
          size: row.size ?? null,
        })
        .returning();
      if (item) items.push(item);
    }
    return { ...order, items };
  }

  async getOrdersByUserId(userId: string): Promise<(Order & { items: OrderItem[] })[]> {
    const orderList = await this.db.select().from(orders).where(eq(orders.user_id, userId)).orderBy(desc(orders.created_at));
    const result: (Order & { items: OrderItem[] })[] = [];
    for (const order of orderList) {
      const items = await this.db.select().from(order_items).where(eq(order_items.order_id, order.id));
      result.push({ ...order, items });
    }
    return result;
  }

  async getOrderBySessionId(sessionId: string): Promise<(Order & { items: OrderItem[] }) | undefined> {
    const [order] = await this.db.select().from(orders).where(eq(orders.stripe_session_id, sessionId)).limit(1);
    if (!order) return undefined;
    const items = await this.db.select().from(order_items).where(eq(order_items.order_id, order.id));
    return { ...order, items };
  }

  async getOrderById(orderId: string): Promise<(Order & { items: OrderItem[] }) | undefined> {
    const [order] = await this.db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order) return undefined;
    const items = await this.db.select().from(order_items).where(eq(order_items.order_id, order.id));
    return { ...order, items };
  }
}

function createStorage(): IStorage {
  const url = process.env.DATABASE_URL;
  if (url) {
    const pool = new Pool({ connectionString: url });
    const db = drizzle(pool);
    console.log("[storage] Using PostgreSQL (DATABASE_URL)");
    return new DrizzleStorage(db);
  }
  console.log("[storage] Using in-memory (MemStorage). Set DATABASE_URL for persistent data.");
  return new MemStorage();
}

export const storage = createStorage();
