"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import InputField from "@/components/InputField";
import PopUpMsg from "@/components/PopUpMsg";
import TextLink from "@/components/TextLink";
import { Button } from "@/components/ui/button";

export default function LoginView(): React.ReactElement {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayPopUp, setDisplayPopUp] = useState(false);

  const onSubmit = async () => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Avoid client-side redirects
    });

    if (result?.ok) {
      window.location.replace("/"); // Client-side redirect after login success
    } else {
      setDisplayPopUp(true);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="flex justify-center min-h-screen">
      <div className="content-center w-1/3">
        {displayPopUp && (
          <PopUpMsg
            message="Invalid email or password!"
            setShouldDisplay={setDisplayPopUp}
            isSuccess={false}
          />
        )}
        <h1 className="text-4xl font-bold text-center my-8 text-white">
          Login
        </h1>
        <InputField
          name="input_email"
          label="Email:"
          type="email"
          input={email}
          setInput={setEmail}
          placeholder="Enter your email address"
        />
        <InputField
          name="input_pw"
          label="Password:"
          type="password"
          input={password}
          setInput={setPassword}
          placeholder="Enter your password"
        />
        <div className="flex justify-center mt-8">
          <Button
            className="bg-white text-black hover:bg-slate-400"
            onClick={onSubmit}
          >
            Login
          </Button>
        </div>
        <div className="flex justify-center mt-8">
          <TextLink
            link="/"
            text="Back"
            spanStyle="text-center"
            linkStyle="text-blue-500 hover:underline"
          />
        </div>
      </div>
    </div>
  );
}
