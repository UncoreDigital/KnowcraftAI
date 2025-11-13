import { type User, type InsertUser, type KnowledgeBase, type InsertKnowledgeBase } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getKnowledgeBaseItems(): Promise<KnowledgeBase[]>;
  createKnowledgeBaseItem(item: InsertKnowledgeBase): Promise<KnowledgeBase>;
  updateKnowledgeBaseItem(id: string, item: Partial<InsertKnowledgeBase>): Promise<KnowledgeBase | undefined>;
  deleteKnowledgeBaseItem(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private knowledgeBase: Map<string, KnowledgeBase>;

  constructor() {
    this.users = new Map();
    this.knowledgeBase = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async getKnowledgeBaseItems(): Promise<KnowledgeBase[]> {
    return Array.from(this.knowledgeBase.values());
  }

  async createKnowledgeBaseItem(insertItem: InsertKnowledgeBase): Promise<KnowledgeBase> {
    const id = randomUUID();
    const now = new Date();
    const item: KnowledgeBase = {
      name: insertItem.name,
      type: insertItem.type,
      source: insertItem.source || null,
      content: insertItem.content || null,
      status: insertItem.status || "processing",
      fileSize: insertItem.fileSize || null,
      category: insertItem.category || null,
      accessLevel: insertItem.accessLevel || "private",
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.knowledgeBase.set(id, item);
    return item;
  }

  async updateKnowledgeBaseItem(id: string, updateData: Partial<InsertKnowledgeBase>): Promise<KnowledgeBase | undefined> {
    const existing = this.knowledgeBase.get(id);
    if (!existing) return undefined;
    
    const updated: KnowledgeBase = {
      ...existing,
      ...updateData,
      updatedAt: new Date(),
    };
    this.knowledgeBase.set(id, updated);
    return updated;
  }

  async deleteKnowledgeBaseItem(id: string): Promise<boolean> {
    return this.knowledgeBase.delete(id);
  }
}

export const storage = new MemStorage();
