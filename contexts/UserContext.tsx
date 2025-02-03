"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { getLoggedInUser } from "@/actions/auth";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  email: string;
  name: string;
  role: "student" | "organizer";
  rollNo?: string;
  department?:
    | "computer"
    | "extc"
    | "it"
    | "mechanical"
    | "civil"
    | "electronics";
  semester?: number;
  phoneNo?: string;
  collegeEmail?: string;
  club?:
    | "NSS"
    | "GDSC"
    | "Algozenith"
    | "AI/DL"
    | "CSI-COMP"
    | "CSI-IT"
    | "IEEE"
    | "FCRIT Council"
    | "ECELL"
    | "Manthan"
    | "AGNEL CYBER CELL"
    | "ECO CLUB"
    | "DEBATE CLUB"
    | "RHYTHM Club"
    | "Agnel Robotics Club"
    | "The drama house fcrit"
    | "Nritya Nation";
};

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  refreshUser: () => Promise<void>;
  setUserNull: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Function to fetch and update user data
  const fetchUser = async () => {
    setLoading(true);
    try {
      const userData = await getLoggedInUser();
      if (
        userData &&
        (!userData.role || !userData.phoneNo || !userData.collegeEmail)
      ) {
        router.push("/getting-started");
      }

      if (userData) {
        const sanitizedUser: User = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          rollNo: userData.rollNo ?? undefined,
          department: userData.department ?? undefined,
          semester: userData.semester ?? undefined,
          phoneNo: userData.phoneNo ?? undefined,
          collegeEmail: userData.collegeEmail ?? undefined,
          club: userData.club ?? undefined,
        };

        setUser(sanitizedUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Function to manually refresh user data
  const refreshUser = async () => {
    await fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const setUserNull = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, loading, refreshUser, setUserNull }}
    >
      {children}
    </UserContext.Provider>
  );
}

// Custom Hook
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
