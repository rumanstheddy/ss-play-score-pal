import HomeView from "@/views/Home";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import NavBar from "@/components/NavBar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserRoundPlus } from "lucide-react";
import TextLink from "@/components/TextLink";

type CustomUser = {
  _id?: string | null | undefined;
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
};

export interface CustomSession extends Session {
  user?: CustomUser & {
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
  };
}

export default async function Home() {
  // Get session on the server
  const session = (await getServerSession(authOptions)) as CustomSession | null;

  const welcomeMsg = session?.user
    ? "Welcome, " + session.user.firstName + "!"
    : "Playscore Pal";

  return (
    <div className="flex flex-col justify-center min-h-screen">
      <NavBar
        name={session?.user ? session.user.firstName : ""}
        isLoggedIn={!!(session && session.user)}
      />
      <h1 className="mb-6 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text text-center">
        {welcomeMsg}
      </h1>
      <HomeView />
      {!session && (
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
