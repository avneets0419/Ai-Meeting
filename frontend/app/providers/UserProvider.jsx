"use client";

import { createContext, useContext, useEffect, useState } from "react";


export const UserContext = createContext(null);

export function useUser() {
  return useContext(UserContext);
}

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;


    fetch(`${API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(() => {
        setUser(null)
        localStorage.removeItem("token")

      });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, API_URL }}>
      {children}
    </UserContext.Provider>
  );
}
