import Search from "@/components/Search";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import NavBar from "@/components/NavBar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserRoundPlus } from "lucide-react";
import TextLink from "@/components/TextLink";
import { CustomSession } from "@/types/types";

export default async function Home() {
  // Get session on the server
  const session = (await getServerSession(authOptions)) as CustomSession | null;

  const welcomeMsg = session?.user
    ? "Welcome, " + session.user.firstName + "!"
    : "Playscore Pal";

  return (
    <div className="flex flex-col justify-center min-h-screen bg-gradient-to-br bg-black text-white">
      <NavBar
        name={session?.user ? session.user.firstName : ""}
        isLoggedIn={!!(session && session.user)}
      />
      <div className="flex flex-col items-center justify-center flex-grow px-4">
        <h1 className="mb-6 p-2 scroll-m-20 text-5xl font-extrabold tracking-tight lg:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400">
          {welcomeMsg}
        </h1>
        <h2 className="mb-4 scroll-m-20 text-2xl font-semibold tracking-tight lg:text-3xl text-center text-gray-200">
          Where gamers share their Playscore!
        </h2>
        <p className="scroll-m-20 text-lg font-normal text-center text-gray-300">
          Share your thoughts and review your favorite games!
        </p>
        <div className="w-[100%] mb-8">
          <Search />
        </div>
        {/* Call-to-action button */}
        {!session && (
          <div className="flex flex-col items-center space-y-4">
            <Link href={"/signup"}>
              <Button
                className="rounded-lg bg-white text-black hover:bg-gray-200 transition-transform transform hover:scale-105"
                type="button"
              >
                <UserRoundPlus className="h-4 w-4 mr-2" />
                <div>Sign Up</div>
              </Button>
            </Link>
            <div className="flex flex-row items-center gap-1">
              <span className="text-sm text-gray-300">Already a member?</span>
              <TextLink
                spanStyle="text-sm"
                linkStyle="text-blue-400 hover:underline hover:text-blue-300"
                link="/login"
                text="Login"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
