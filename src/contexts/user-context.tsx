"use client"

import * as React from "react"

export type UserRole = "admin" | "member"

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  initials: string
  department: string
}

interface UserContextType {
  user: User
  setUser: (user: User) => void
  switchRole: (role: UserRole) => void
  isAdmin: boolean
  isMember: boolean
}

const defaultAdmin: User = {
  id: "1",
  name: "John Doe",
  email: "john@nexus.dev",
  role: "admin",
  initials: "JD",
  department: "Engineering",
}

const defaultMember: User = {
  id: "2",
  name: "Sarah Chen",
  email: "sarah@nexus.dev",
  role: "member",
  initials: "SC",
  department: "Design",
}

const UserContext = React.createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User>(defaultMember)

  const switchRole = React.useCallback((role: UserRole) => {
    if (role === "admin") {
      setUser(defaultAdmin)
    } else {
      setUser(defaultMember)
    }
  }, [])

  const value = React.useMemo(
    () => ({
      user,
      setUser,
      switchRole,
      isAdmin: user.role === "admin",
      isMember: user.role === "member",
    }),
    [user, switchRole]
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = React.useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
