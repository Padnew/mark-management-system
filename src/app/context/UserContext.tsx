"use client";
import { createContext, Context } from "react";
import { User } from "../types";

// Defines the interface for the UserContext
//Sourced and influenced by: https://medium.com/@erbashakann/how-to-use-context-api-basically-with-authentication-example-33b36d955734
interface UserContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoadingUser: boolean;
}
//Primary source from: https://react.dev/reference/react/createContext
//Defines the userContext to be used throughout
const UserContext: Context<UserContextType | null> =
  createContext<UserContextType | null>(null);

export default UserContext;
