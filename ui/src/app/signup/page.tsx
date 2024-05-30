"use client";

import Link from "next/link";
import { useState } from "react";
import { XCircleIcon } from "@heroicons/react/16/solid";

export default function Signup() {
  const [fName, setFname] = useState("");
  const [lName, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);

  const successMsgStr = "You've registered successfully!";

  const signUp = async () => {
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

    return response;
  };

  const clearFields = () => {
    setFname("");
    setLname("");
    setEmail("");
    setPassword("");
  };

  const onSubmit = async () => {
    const response = await signUp();
    if (response.status === 201) setIsSignupSuccess(true);
    console.log(response.status);
    clearFields();
  };

  const displaySuccessMsg = () =>
    isSignupSuccess ? (
      <div className="rounded-lg bg-green-500 px-4 py-1 mb-5">
        {successMsgStr}
        <Link
          href={"/login"}
          className="pl-2 text-blue-600 hover:underline hover:text-blue-800"
        >
          Login
        </Link>
        <XCircleIcon
          className="size-4 inline-block ml-3 mb-0.5 hover:cursor-pointer"
          onClick={() => setIsSignupSuccess(false)}
        />
      </div>
    ) : (
      <></>
    );

  return (
    <div className="flex justify-center min-h-screen">
      <div className="content-center">
        {displaySuccessMsg()}
        <h1 className="text-4xl text-center mb-4">Sign Up</h1>
        <div className="flex flex-col">
          <label htmlFor="input_fName" className="inline-block">
            First Name:
          </label>
          <input
            name="input_fName"
            type="text"
            className="text-black rounded-lg placeholder:pl-2"
            placeholder="Enter your First Name"
            value={fName}
            onChange={(e) => setFname(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="input_lName" className="inline-block mt-2">
            Last Name:
          </label>
          <input
            name="input_lName"
            type="text"
            className="text-black rounded-lg placeholder:pl-2"
            placeholder="Enter your Last Name"
            value={lName}
            onChange={(e) => setLname(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="input_email" className="inline-block mt-2">
            Email:
          </label>
          <input
            name="input_email"
            type="email"
            className="text-black rounded-lg placeholder:pl-2"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="input_pw" className="inline-block mt-2">
            Password:
          </label>
          <input
            name="input_pw"
            type="password"
            className="text-black rounded-lg placeholder:pl-2"
            placeholder="Enter a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex justify-center">
          <button
            className="rounded-lg bg-white py-3 px-6 text-center 
            align-middle text-black mt-5"
            type="button"
            onClick={() => onSubmit()}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
