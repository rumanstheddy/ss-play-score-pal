"use client";
import NavBar from "@/components/NavBar";
import SearchBar from "@/components/SearchBar";
import TextLink from "@/components/TextLink";
import { Button } from "@/components/ui/button";
import useDebounce from "@/hooks/useDebounce";
import useDebouncedQuery from "@/hooks/useDebounedQuery";
import { searchGame } from "@/providers/IGDB/IgdbProvider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UserRoundPlus } from "lucide-react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

type CustomUser = {
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
};

interface CustomSession extends Session {
  user?: CustomUser & {
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
  };
}

export default function HomeView() {
  const { data: session } = useSession() as { data: CustomSession | null };

  const [searchText, setSearchText]: [string, (searchText: string) => void] =
    useState<string>("");

  const welcomeMsg = session?.user
    ? "Welcome, " + session.user.firstName + "!"
    : "SS Playscore Pal";

  const body: string =
    "fields name,summary;" +
    "limit 5;" +
    `search "${useDebounce(searchText)}"` +
    ";" +
    "where platforms.summary = null;";

  const { isLoading, data: searchResults } = useDebouncedQuery(
    body,
    ["searchGames"],
    searchGame
  );

  type gameResult = {
    id: number;
    name: string;
    summary: string;
  };

  const displaySearchResults = () => {
    if (isLoading)
      return <div className="text text-center">Searching for your game...</div>;
    if (searchResults) {
      console.log(searchResults);
      return searchResults.map((result: gameResult) => (
        <div
          className="self-center h-10 w-2/4 pt-2 text-sm text-center rounded-md border bg-white text-black"
          key={result.id}
        >
          {result.name}
        </div>
      ));
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-screen">
      <>
        <NavBar
          name={session?.user ? session.user.firstName : ""}
          isLoggedIn={!!(session && session.user)}
        />
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text text-center mb-4">
          {welcomeMsg}
        </h1>
        <div className="flex flex-col">
          <div className="flex flex-row justify-center">
            <SearchBar
              placeHolder="Search for a game"
              searchText={searchText}
              setSearch={setSearchText}
            />
          </div>
          {displaySearchResults()}
        </div>
      </>
      {session?.user ? (
        <></>
      ) : (
        <>
          <div className="flex flex-row justify-center">
            <Link href={"/signup"}>
              <Button
                className="rounded-lg bg-white w-30 mt-8 py-3 px-6 align-middle text-black
              hover:bg-slate-400"
                type="button"
              >
                <UserRoundPlus className="h-4 w-4 mr-2" />
                <div>Sign Up</div>
              </Button>
            </Link>
          </div>
          <div className="flex flex-row justify-center items-center">
            <span className="text text-center mt-8 text-sm">
              Already a member?
            </span>
            <TextLink
              spanStyle="text-center mt-8 text-md ml-2"
              linkStyle="text-blue-500 hover:underline hover:text-blue-700"
              link="/login"
              text="Login"
            />
          </div>
        </>
      )}
    </div>
  );
}
