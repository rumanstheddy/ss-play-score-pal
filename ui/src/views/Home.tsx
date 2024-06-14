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
        <NavBar
          name={session?.user ? session.user.firstName : ""}
          isLoggedIn={session && session.user}
        />
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text text-center mb-4">
          {welcomeMsg}
        </h1>
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
              linkStyle="text-blue-500 hover:text-blue-700 text-center hover:underline text-lg"
              link="/signup"
              text="Sign Up"
            />
            <TextLink
              spanStyle="text-center mt-4"
              linkStyle="text-blue-500 hover:text-blue-700 text-center hover:underline text-lg"
              link="/login"
              text="Login"
            />
          </>
        )}
      </div>
    </>
  );
}
