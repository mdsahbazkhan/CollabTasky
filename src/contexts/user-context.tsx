"use client";

import * as React from "react";
import { getMe } from "@/src/services/auth.service";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  switchRole: (role: "admin" | "member") => void;
  isAdmin: boolean;
}

const UserContext = React.createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [role, setRole] = React.useState<"admin" | "member">("member");

  // 🔥 fetch user on load
  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe();
        setUser(data);
        // Set initial role from user data if available
        if (data?.role === "admin") {
          setRole("admin");
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const switchRole = (newRole: "admin" | "member") => {
    setRole(newRole);
  };

  const isAdmin = role === "admin";

  const value = React.useMemo(
    () => ({
      user,
      setUser,
      loading,
      switchRole,
      isAdmin,
    }),
    [user, loading, role],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
