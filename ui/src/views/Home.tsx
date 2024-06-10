"use client";
import NavBar from "@/components/NavBar";
import SearchBar from "@/components/SearchBar";
import TextLink from "@/components/TextLink";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function HomeView() {
  const { data: session } = useSession();
  const welcomeMsg = session?.user
    ? "Welcome " + session.user.firstName + "!"
    : "SS Playscore Pal";

  const [searchText, setSearch] = useState("");

  return (
    <>
      <div className="flex flex-col justify-center min-h-screen">
        <NavBar name={session?.user ? session.user.firstName : ""} />
        <h1 className="text-4xl text-white text-center mb-4">{welcomeMsg}</h1>
        {/** //TODO: Use a search bar here */}
        <div className="flex flex-row justify-center">
          <SearchBar
            placeHolder="Search for a game"
            searchText={searchText}
            setSearch={setSearch}
          />
        </div>
        {session?.user ? (
          <></>
        ) : (
          <>
            <TextLink
              spanStyle="text-center mt-4"
              linkStyle=" text-blue-500 hover:text-blue-700 text-center hover:underline"
              link="/signup"
              text="Sign Up"
            />
            <TextLink
              spanStyle="text-center mt-4"
              linkStyle=" text-blue-500 hover:text-blue-700 text-center hover:underline"
              link="/login"
              text="Login"
            />
          </>
        )}
      </div>
    </>
  );
}
