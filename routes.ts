import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateCodeSchema, type GenerateCodeRequest } from "@shared/schema";
import { generateWebsite } from "./services/openai";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate website code
  app.post("/api/generate", async (req, res) => {
    try {
      const { prompt, sessionId } = generateCodeSchema.parse(req.body);
      
      // Generate website using OpenAI
      const generatedWebsite = await generateWebsite(prompt);
      
      // Save user message
      const userMessage = await storage.createMessage({
        content: prompt,
        role: "user",
        sessionId,
        generatedCode: null,
      });
      
      // Save AI response
      const aiMessage = await storage.createMessage({
        content: `I've generated a ${generatedWebsite.title} for you. Here's the complete code:`,
        role: "assistant",
        sessionId,
        generatedCode: generatedWebsite,
      });
      
      res.json({
        userMessage,
        aiMessage,
        generatedCode: generatedWebsite,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid request data", 
          errors: error.errors 
        });
      }
      
      console.error("Error generating website:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate website" 
      });
    }
  });
  
  // Get chat history
  app.get("/api/messages/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const messages = await storage.getMessagesBySession(sessionId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });
  
  // Clear chat history
  app.delete("/api/messages/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      await storage.clearMessagesBySession(sessionId);
      res.json({ message: "Chat history cleared" });
    } catch (error) {
      console.error("Error clearing messages:", error);
      res.status(500).json({ message: "Failed to clear messages" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
