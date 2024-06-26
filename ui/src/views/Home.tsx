"use client";
import NavBar from "@/components/NavBar";
import SearchBar from "@/components/SearchBar";
import TextLink from "@/components/TextLink";
import { Button } from "@/components/ui/button";
import useDebouncedQuery from "@/hooks/useDebounedQuery";
import { searchGame } from "@/providers/IGDB/IgdbProvider";
import { UserRoundPlus } from "lucide-react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

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

export default function HomeView(): React.ReactElement {
  const { data: session } = useSession() as { data: CustomSession | null };

  const [searchText, setSearchText]: [string, (searchText: string) => void] =
    useState<string>("");

  const welcomeMsg = session?.user
    ? "Welcome, " + session.user.firstName + "!"
    : "SS Playscore Pal";

  const body: string =
    "fields name,summary;" +
    "limit 5;" +
    `search "${searchText}"` +
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
    if (searchText !== "" && isLoading)
      return (
        <div className="text text-center mt-6">Searching for your game...</div>
      );
    if (searchResults && searchResults.length > 0) {
      console.log("searchResults: ", searchResults);
      return (
        <div className="self-center w-2/4 py-2 text-center rounded-md bg-white text-black">
          {searchResults.map((result: gameResult) => (
            <p key={result.id} className="block py-3">
              {result.name}
            </p>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-screen">
      <>
        <NavBar
          name={session?.user ? session.user.firstName : ""}
          isLoggedIn={!!(session && session.user)}
        />
        <h1 className="mb-6 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text text-center">
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
                className="rounded-lg bg-white w-30 mt-10 py-3 px-6 align-middle text-md text-black
              hover:bg-slate-400"
                type="button"
              >
                <UserRoundPlus className="h-5 w-5 mr-2" />
                <div>Sign Up</div>
              </Button>
            </Link>
          </div>
          <div className="flex flex-row justify-center items-center">
            <span className="text text-center mt-10 text-sm">
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
