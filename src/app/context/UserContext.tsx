"use client";
import { createContext, Context } from 'react';

interface User {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: number;
}

interface UserContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const UserContext: Context<UserContextType | null> = createContext<UserContextType | null>(null);

export default UserContext;