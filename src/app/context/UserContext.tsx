"use client";
import { createContext, Context } from 'react';
import { User } from '../types';

interface UserContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const UserContext: Context<UserContextType | null> = createContext<UserContextType | null>(null);

export default UserContext;