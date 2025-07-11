import { messages, type Message, type InsertMessage } from "@shared/schema";

export interface IStorage {
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesBySession(sessionId: string): Promise<Message[]>;
  clearMessagesBySession(sessionId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private messages: Map<number, Message>;
  private currentId: number;

  constructor() {
    this.messages = new Map();
    this.currentId = 1;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentId++;
    const message: Message = {
      ...insertMessage,
      id,
      createdAt: new Date(),
    };
    this.messages.set(id, message);
    return message;
  }

  async getMessagesBySession(sessionId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter((message) => message.sessionId === sessionId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async clearMessagesBySession(sessionId: string): Promise<void> {
    const messageIds = Array.from(this.messages.entries())
      .filter(([_, message]) => message.sessionId === sessionId)
      .map(([id]) => id);
    
    messageIds.forEach(id => this.messages.delete(id));
  }
}

export const storage = new MemStorage();
