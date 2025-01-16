"use client";
import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_ROUTES } from "@/utils/apiRoutes";

// Create AuthContext
export const AuthContext = createContext(null);

// AuthProvider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Fetch the authenticated user
  const refreshUser = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      fetch(API_ROUTES.USER, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUser(data); // Update user state
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
          setUser(null); // Clear user if there's an error
        });
    } else {
      setUser(null); // Clear user if no token is found
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  // Login function
  const login = (token) => {
    document.cookie = `token=${token}; path=/;`;
    router.push("/dashboard");
  };

  // Logout function
  const logout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setUser(null);
    router.push("/auth/login");
  };

  // Provide the context value
  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
