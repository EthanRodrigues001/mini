"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import useSWR from "swr";
import { getLoggedInUser, signOut } from "@/actions/auth";
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
  club?: string;
};

type UserContextType = {
  user: User | null;
  loading: boolean;
  refreshUser: () => void;
  logoutUser: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [localUser, setLocalUser] = useState<User | null>(null);

  const fetchUser = async () => {
    const userData = await getLoggedInUser();
    setLocalUser(userData);
    return userData;
  };

  const {
    data: user,
    mutate,
    isLoading,
  } = useSWR<User | null>("user", fetchUser, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 1000 * 60 * 60 * 24,
  });

  useEffect(() => {
    if (user !== undefined) {
      setLocalUser(user);
    }
  }, [user]);

  // Function to manually refresh user data

  const refreshUser = useCallback(async () => {
    await mutate();
  }, [mutate]);

  // Function to log out user
  const logoutUser = async () => {
    setLocalUser(null);
    await signOut();

    await mutate(null);
    router.push("/sign-in");
  };

  return (
    <UserContext.Provider
      value={{
        user: localUser,
        loading: isLoading,
        refreshUser,
        logoutUser,
      }}
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
