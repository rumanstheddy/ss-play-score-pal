"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

interface INextAuthProps {
  children?: React.ReactNode;
  session?: Session | null;
}

export default function NextAuthProvider({
  children,
  session,
}: INextAuthProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
