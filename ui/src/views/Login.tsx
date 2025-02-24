"use client";

import InputField from "@/components/InputField";
import PopUpMsg from "@/components/PopUpMsg";
import TextLink from "@/components/TextLink";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginView(): React.ReactElement {
  const [email, setEmail]: [string, (email: string) => void] =
    useState<string>("");
  const [password, setPassword]: [string, (password: string) => void] =
    useState<string>("");

  const [displayPopUp, setDisplayPopUp] = useState<boolean>(false);

  const errorMessage: string = "Invalid email or password!";

  const clearFields = (): void => {
    setEmail("");
    setPassword("");
  };

  const onSubmit = async () => {
    const result = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
      callbackUrl: "/",
    });

    if (result?.ok) {
      window.location.href = "/";
    } else {
      setDisplayPopUp(true);
      clearFields();
    }
  };

  const displayErrorPopUp = (): React.ReactElement =>
    displayPopUp ? (
      <PopUpMsg
        message={errorMessage}
        // link="/login"
        setShouldDisplay={setDisplayPopUp}
        isSuccess={false}
      />
    ) : (
      <></>
    );

  return (
    <div className="flex justify-center min-h-screen">
      <div className="content-center w-1/3">
        {displayErrorPopUp()}
        <h1 className="scroll-m-20 pb-2 text-4xl font-bold tracking-tight first:mt-0 text text-center mb-3 mt-12">
          Login
        </h1>
        <div className="flex flex-col mt-8">
          <InputField
            input={email}
            label="Email:"
            name="input_email"
            type="email"
            placeholder="Enter your email"
            setInput={setEmail}
          />
        </div>
        <div className="flex flex-col mt-8">
          <InputField
            name="input_pw"
            label="Password:"
            type="password"
            placeholder="Enter a password"
            input={password}
            setInput={setPassword}
          />
        </div>
        <div className="flex flex-row justify-center mt-8">
          <Button
            className="rounded-lg bg-white py-3 px-6 text-center text-black text-md hover:bg-slate-400"
            type="button"
            onClick={() => onSubmit()}
          >
            Login
          </Button>
        </div>
        <div className="flex flex-col">
          <TextLink
            link="/"
            spanStyle="text-center mt-8 text-"
            linkStyle="text-blue-500 hover:underline hover:text-blue-700"
            text="Back"
          />
        </div>
      </div>
    </div>
  );
}
