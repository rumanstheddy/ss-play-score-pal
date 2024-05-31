import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center min-h-screen">
      <div className=" flex-col content-center">
        <h1 className="text-4xl text-white mb-5 text-center">
          SS Playscore Pal
        </h1>
        <Link
          className="block text-blue-500 hover:text-blue-700 text-center hover:underline"
          href="/signup"
        >
          Sign Up
        </Link>
        <Link
          className="block text-blue-500 hover:text-blue-700 text-center hover:underline"
          href="/login"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
