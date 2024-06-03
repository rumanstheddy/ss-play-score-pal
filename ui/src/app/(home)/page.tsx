import NavBar from "@/components/NavBar";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <NavBar />
      <div className="flex flex-col justify-center min-h-screen">
        <h1 className="text-4xl text-white mb-5 text-center">
          SS Playscore Pal
        </h1>
        <span className="text-center">
          <Link
            className=" text-blue-500 hover:text-blue-700 text-center hover:underline"
            href="/signup"
          >
            Sign Up
          </Link>
        </span>
        <span className="text-center">
          <Link
            className=" text-blue-500 hover:text-blue-700 text-center hover:underline"
            href="/login"
          >
            Login
          </Link>
        </span>
      </div>
    </>
  );
}
