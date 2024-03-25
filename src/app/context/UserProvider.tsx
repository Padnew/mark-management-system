"use client";
import React, { useState, ReactNode, useEffect } from "react";
import UserContext from "./UserContext";

interface UserProviderProps {
  children: ReactNode;
}

//Implements the user context and defines all functionality
// Influenced by: https://stackoverflow.com/questions/74298603/how-to-better-type-a-react-context-to-assume-that-the-value-will-always-be-defin
const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  useEffect(() => {
    //Check if a user is already logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoadingUser(false);
  }, []);

  //Defines the login functionality
  const login = async (email: string, password: string) => {
    //Hit the endpoint to use the local strategy in passport.js
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      return true;
    } else {
      console.error("Login failed");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    //Remove from local storage for safety
    localStorage.removeItem("user");
  };

  // Works to provide user information from the context to all child elements in layout.tsx
  // Sourced from: https://legacy.reactjs.org/docs/context.html
  return (
    <UserContext.Provider value={{ user, login, logout, isLoadingUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
