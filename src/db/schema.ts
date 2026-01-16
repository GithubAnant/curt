import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";

// --- Better Auth Tables ---

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  expiresAt: timestamp("expiresAt"),
  password: text("password"),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
});

// --- Game Tables ---

export const dailyTexts = pgTable("daily_texts", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  title: text("title"),
  date: text("date").notNull().unique(), // YYYY-MM-DD
  difficulty: text("difficulty").default("medium"),
  targetWpm: integer("target_wpm").default(300),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const readings = pgTable("readings", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  textId: integer("text_id")
    .notNull()
    .references(() => dailyTexts.id),
  wpmAchieved: integer("wpm_achieved").notNull(),
  accuracy: integer("accuracy"), // Placeholder for future comprehension check
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});
