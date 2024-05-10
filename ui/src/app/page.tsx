import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1 className="text-4xl text-white mb-5">SS Playscore Pal</h1>
      <Link className="block hover:text-blue-700" href="/signup">
        Sign Up
      </Link>
      <Link className="block hover:text-blue-700" href="/login">
        Login
      </Link>
    </>
  );
}
