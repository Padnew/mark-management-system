"use client";
import React, { useState, ReactNode } from 'react';
import UserContext from './UserContext';

interface UserProviderProps {
  children: ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<any>(null);

    const login = async (username: string, password: string) => {
        const response = await fetch("http://localhost:20502/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        console.log(response)

        if (response.ok) {
            const data = await response.json();
            console.log(data)
            setUser(data.user);
        } else {
            console.error("Login failed");
        }
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;