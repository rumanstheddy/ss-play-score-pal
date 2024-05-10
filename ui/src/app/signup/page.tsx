"use client";

import { useState } from "react";

export default function Signup() {
  const [fName, setFname] = useState("");
  const [lName, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup_POST = async () => {
    const body = {
      firstName: fName,
      lastName: lName,
      email: email,
      password: password,
    };

    const response = await fetch("http://localhost:4000/signup", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return response.json();
  };

  const signup = async () => {
    const data = await signup_POST();
    console.log(data);
  };

  return (
    <>
      <h1 className="text-4xl">Sign Up</h1>
      <label htmlFor="input_fName" className="inline-block">
        First Name:
      </label>
      <input
        name="input_fName"
        type="text"
        className="block text-black"
        placeholder="Enter your First Name"
        value={fName}
        onChange={(e) => setFname(e.target.value)}
      />
      <label htmlFor="input_lName" className="inline-block">
        Last Name:
      </label>
      <input
        name="input_lName"
        type="text"
        className="block text-black"
        placeholder="Enter your Last Name"
        value={lName}
        onChange={(e) => setLname(e.target.value)}
      />
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
        onClick={() => signup()}
      >
        Sign Up
      </button>
    </>
  );
}
