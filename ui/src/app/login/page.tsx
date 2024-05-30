"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    <>
      <h1 className="text-4xl">Login</h1>
      <label htmlFor="input_email" className="inline-block">
        Email:
      </label>
      <input
        name="input_email"
        type="email"
        className="block text-black"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label htmlFor="input_pw" className="inline-block">
        Password:
      </label>
      <input
        name="input_pw"
        type="password"
        className="block text-black"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="rounded-lg bg-white py-3 px-6 text-center align-middle text-black mt-3"
        type="button"
        onClick={() => onSubmit()}
      >
        Login
      </button>
    </>
  );
}
