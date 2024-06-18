"use client";

import InputField from "@/components/InputField";
import TextLink from "@/components/TextLink";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginView(): React.ReactElement {
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

    if (result?.error) console.log(result.error);
  };

  return (
    <div className="flex justify-center min-h-screen">
      <div className="content-center">
        <h1 className="scroll-m-20 pb-2 text-4xl font-semibold tracking-tight first:mt-0 text text-center mb-3">
          Login
        </h1>
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
        <div className="flex flex-row justify-center">
          <Button
            className="rounded-lg bg-white py-3 px-6 text-center text-black mt-6 hover:bg-slate-400"
            type="button"
            onClick={() => onSubmit()}
          >
            Login
          </Button>
        </div>
        <div className="flex flex-col">
          <TextLink
            link="/"
            spanStyle="text-center mt-4"
            linkStyle="text-blue-500 hover:underline hover:text-blue-700"
            text="Back"
          />
        </div>
      </div>
    </div>
  );
}
