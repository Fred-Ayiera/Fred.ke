import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  sessionId: text("session_id").notNull(),
  generatedCode: jsonb("generated_code"), // Store generated code files
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export const generateCodeSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  sessionId: z.string().min(1, "Session ID is required"),
});

export type GenerateCodeRequest = z.infer<typeof generateCodeSchema>;
