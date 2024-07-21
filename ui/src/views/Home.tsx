"use client";
import NavBar from "@/components/NavBar";
import SearchBar from "@/components/SearchBar";
import SearchResult from "@/components/SearchResult";
import TextLink from "@/components/TextLink";
import { Button } from "@/components/ui/button";
import useDebouncedQuery from "@/hooks/useDebounedQuery";
import { fetchGames } from "@/providers/IGDB/IgdbProvider";
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

type ProviderFnArgs = {
  fields: string[];
  limit: number;
  search: string;
  filters: string[];
};

type Game = {
  id: number;
  name: string;
  summary: string;
};

export default function HomeView(): React.ReactElement {
  const { data: session } = useSession() as { data: CustomSession | null };

  const [searchText, setSearchText]: [string, (searchText: string) => void] =
    useState<string>("");

  const welcomeMsg = session?.user
    ? "Welcome, " + session.user.firstName + "!"
    : "SS Playscore Pal";

  const args: ProviderFnArgs = {
    fields: ["name", "summary"],
    limit: 5,
    search: searchText,
    filters: ["platforms.summary = null"],
  };

  const { isLoading, data: results } = useDebouncedQuery(
    args,
    ["searchGames"],
    fetchGames
  );

  const displaySearchResults = () => {
    if (searchText !== "" && isLoading)
      return <div className="text text-center mt-6">Searching...</div>;
    if (results && results.length > 0) {
      return (
        <div className="self-center w-2/4 py-2 text-center rounded-md bg-white text-black">
          {results.map((result: Game) => (
            <SearchResult
              key={result.id}
              link={`/games/${result.id}`}
              name={result.name}
            />
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
          <div className="mt-12">
            <div className="flex flex-row justify-center">
              <Link href={"/signup"}>
                <Button
                  className="rounded-lg bg-white w-30 py-3 px-6 align-middle text-black
              hover:bg-slate-400"
                  type="button"
                >
                  <UserRoundPlus className="h-4 w-4 mr-2" />
                  <div>Sign Up</div>
                </Button>
              </Link>
            </div>
            <div className="flex flex-row justify-center items-center">
              <span className="text text-center mt-10 text-sm">
                Already a member?
              </span>
              <TextLink
                spanStyle="text-center text-sm mt-10 ml-1.5"
                linkStyle="text-blue-500 hover:underline hover:text-blue-700"
                link="/login"
                text="Login"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
