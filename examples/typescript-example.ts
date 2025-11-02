// TypeScript Example - User Service Implementation
// This demonstrates a typical TypeScript service class

import axios, { AxiosInstance } from 'axios';
import { writeFileSync } from 'fs';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

export class UserService {
  private httpClient: AxiosInstance;
  private users: User[];

  constructor(baseURL: string) {
    this.httpClient = axios.create({ baseURL });
    this.users = [];
  }

  async getUser(userId: number): Promise<User | null> {
    try {
      const response = await this.httpClient.get<User>(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch user ${userId}:`, error);
      return null;
    }
  }

  createUser(name: string, email: string): User {
    if (!name || name.trim() === '') {
      throw new Error('Name cannot be empty');
    }

    if (!email || email.trim() === '') {
      throw new Error('Email cannot be empty');
    }

    const user: User = {
      id: this.users.length + 1,
      name: name.trim(),
      email: email.trim(),
      createdAt: new Date(),
    };

    this.users.push(user);
    return user;
  }

  searchUsers(searchTerm: string): User[] {
    if (!searchTerm) {
      return this.users;
    }

    const term = searchTerm.toLowerCase();
    return this.users.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
  }

  exportToFile(filePath: string): void {
    const json = JSON.stringify(this.users, null, 2);
    writeFileSync(filePath, json, 'utf-8');
  }
}

