"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import {
  AuthResponse,
  UserProfile,
  getCurrentUserProfile
} from "../lib/api";

interface SessionState {
  userId: string;
  token: string;
}

interface SessionContextValue {
  session: SessionState | null;
  profile: UserProfile | null;
  isReady: boolean;
  isAuthenticated: boolean;
  authenticate: (response: AuthResponse) => Promise<void>;
  refreshProfile: () => Promise<void>;
  signOut: () => void;
}

const SESSION_STORAGE_KEY = "hobby2hobby.session";

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [session, setSession] = useState<SessionState | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const rawValue = window.localStorage.getItem(SESSION_STORAGE_KEY);

    if (!rawValue) {
      setIsReady(true);
      return;
    }

    try {
      const parsed = JSON.parse(rawValue) as SessionState;
      setSession(parsed);
    } catch {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!session) {
      setProfile(null);
      return;
    }

    let cancelled = false;

    void getCurrentUserProfile(session.token)
      .then((nextProfile) => {
        if (!cancelled) {
          setProfile(nextProfile);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSession(null);
          setProfile(null);
          if (typeof window !== "undefined") {
            window.localStorage.removeItem(SESSION_STORAGE_KEY);
          }
        }
      });

    return () => {
      cancelled = true;
    };
  }, [session]);

  async function authenticate(response: AuthResponse): Promise<void> {
    const nextSession = {
      userId: response.userId,
      token: response.token
    };

    setSession(nextSession);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
    }

    const nextProfile = await getCurrentUserProfile(response.token);
    setProfile(nextProfile);
  }

  async function refreshProfile(): Promise<void> {
    if (!session) {
      return;
    }

    const nextProfile = await getCurrentUserProfile(session.token);
    setProfile(nextProfile);
  }

  function signOut(): void {
    setSession(null);
    setProfile(null);

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }

  const value: SessionContextValue = {
    session,
    profile,
    isReady,
    isAuthenticated: session !== null,
    authenticate,
    refreshProfile,
    signOut
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const value = useContext(SessionContext);

  if (!value) {
    throw new Error("useSession must be used within SessionProvider");
  }

  return value;
}
