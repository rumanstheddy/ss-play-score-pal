"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

interface InavBarProps {
  name?: string | null | undefined;
  isLoggedIn: boolean | null;
}

export default function NavBar({
  name,
  isLoggedIn,
}: InavBarProps): React.ReactElement {
  return (
    <div className="relative z-50">
      <div className="fixed top-0 w-screen bg-gray-950 z-10">
        <div className="flex flex-col justify-center h-16">
          <div className="flex flex-row text-lg items-center">
            <span className="text basis-1/6 text-center">{name}</span>
            <span className="basis-4/6 text-center text font-bold tracking-tight z-10">
              <Link href="/" className="hover:underline z-10">
                Home
              </Link>
            </span>
            {isLoggedIn ? (
              <div className="basis-1/6 flex flex-row justify-center">
                <Button
                  className="w-30 text-center text hover:bg-red-800 hover:cursor-pointer"
                  onClick={() => signOut()}
                  variant="destructive"
                >
                  Logout
                  <LogOut className="h-4 w-4 ml-2" />
                </Button>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
