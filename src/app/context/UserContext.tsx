"use client";
import { createContext, Context } from "react";
import { User } from "../types";

interface UserContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoadingUser: boolean;
}

const UserContext: Context<UserContextType | null> =
  createContext<UserContextType | null>(null);

export default UserContext;
