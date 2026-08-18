"use client";
import { ReactNode, useEffect, useState } from "react";
import LoginScreen from "@/components/LoginScreen";
import { isLoggedIn } from "@/lib/auth";

// Gates every route behind the login screen until the stored auth flag is
// set. Renders nothing on the very first paint so we don't flash the login
// form before localStorage has been checked.
export default function AuthGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedInState] = useState(false);

  useEffect(() => {
    setLoggedInState(isLoggedIn());
    setReady(true);
  }, []);

  if (!ready) return null;
  if (!loggedIn) return <LoginScreen onSuccess={() => setLoggedInState(true)} />;
  return <>{children}</>;
}
