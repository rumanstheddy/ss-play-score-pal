"use client";

import InputField from "@/components/InputField";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [email, setEmail]: [string, (email: string) => void] =
    useState<string>("");
  const [password, setPassword]: [string, (password: string) => void] =
    useState<string>("");

  const onSubmit = async () => {
    const result = await signIn("credentials", {
      email: email,
      password: password,
      redirect: true,
      callbackUrl: "/",
    });

    console.log(result);
  };

  return (
    <div className="flex justify-center min-h-screen">
      <div className="content-center">
        <h1 className="text-4xl text-center mb-3">Login</h1>
        <div className="flex flex-col">
          <InputField
            input={email}
            label="Email:"
            name="input_email"
            type="email"
            placeholder="Enter your email"
            setInput={setEmail}
          />
        </div>
        <div className="flex flex-col">
          <InputField
            name="input_pw"
            label="Password:"
            type="password"
            placeholder="Enter a password"
            input={password}
            setInput={setPassword}
          />
        </div>
        <div className="flex justify-center">
          <button
            className="rounded-lg bg-white py-3 px-6 text-center align-middle text-black mt-5"
            type="button"
            onClick={() => onSubmit()}
          >
            Login
          </button>
        </div>
        <div className="flex flex-col">
          <span className="text-center mt-4">
            <Link
              href="/"
              className=" text-blue-500 hover:underline hover:text-blue-600"
            >
              Home
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
