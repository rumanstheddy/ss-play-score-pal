"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const body = {
      email: email,
      password: password,
    };

    const response = await fetch("http://localhost:4000/login", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return response.json();
  };

  const loggedin = async () => {
    const data = await login();
    console.log(data);
  };

  return (
    <>
      <h1 className="text-4xl">SS Playscore Pal</h1>
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
        onClick={() => loggedin()}
      >
        Login
      </button>
    </>
  );
}
