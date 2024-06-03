import Link from "next/link";
import React from "react";

export default function NavBar(): React.ReactElement {
  return (
    <div className="fixed top-0 w-screen bg-gray-800 h-12">
      <div className="flex flex-col justify-center h-12">
        <div className="flex flex-row text-xl">
          <span className="basis-1/4 text-center">Sumanth</span>
          <span className="basis-2/4 text-center hover:underline">
            <Link href="/">Home</Link>
          </span>
          <span className="basis-1/4 text-center text-red-700 hover:underline hover:text-red-800">
            <Link href="">Logout</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
