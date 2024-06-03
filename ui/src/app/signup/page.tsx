"use client";

import { useState } from "react";
import InputField from "@/components/InputField";
import PopUpMsg from "@/components/PopUpMsg";
import TextLink from "@/components/TextLink";

export default function Signup(): React.ReactElement {
  const [fName, setFname]: [string, (fName: string) => void] =
    useState<string>("");
  const [lName, setLname]: [string, (lName: string) => void] =
    useState<string>("");
  const [email, setEmail]: [string, (email: string) => void] =
    useState<string>("");
  const [password, setPassword]: [string, (password: string) => void] =
    useState<string>("");
  const [isSignupSuccess, setIsSignupSuccess]: [
    boolean,
    (isSignupSuccess: boolean) => void
  ] = useState<boolean>(false);

  const successMsgStr: string = "You've registered successfully!";

  interface IsignupBody {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }

  const signUp = async (): Promise<Response> => {
    const body: IsignupBody = {
      firstName: fName,
      lastName: lName,
      email: email,
      password: password,
    };

    const response: Response = await fetch("http://localhost:4000/signup", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return response;
  };

  const clearFields = (): void => {
    setFname("");
    setLname("");
    setEmail("");
    setPassword("");
  };

  const onSubmit = async () => {
    const response: Response = await signUp();
    if (response.status === 201) setIsSignupSuccess(true);
    clearFields();
  };

  const displaySuccessMsg = (): React.ReactElement =>
    isSignupSuccess ? (
      <PopUpMsg
        message={successMsgStr}
        link="/login"
        setShouldDisplay={setIsSignupSuccess}
        isSuccess={true}
      />
    ) : (
      <></>
    );

  return (
    <div className="flex justify-center min-h-screen">
      <div className="content-center">
        {displaySuccessMsg()}
        <h1 className="text-4xl text-center mb-4">Sign Up</h1>
        <div className="flex flex-col">
          <InputField
            name="input_fName"
            label="First Name:"
            type="text"
            placeholder="Enter your First Name"
            input={fName}
            setInput={setFname}
          />
        </div>
        <div className="flex flex-col">
          <InputField
            name="input_lName"
            label="Last Name:"
            type="text"
            placeholder="Enter your Last Name"
            input={lName}
            setInput={setLname}
          />
        </div>
        <div className="flex flex-col">
          <InputField
            name="input_email"
            label="Email:"
            type="email"
            placeholder="Enter your email"
            input={email}
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
            className="rounded-lg bg-white py-3 px-6 text-center 
            align-middle text-black mt-5"
            type="button"
            onClick={() => onSubmit()}
          >
            Sign Up
          </button>
        </div>
        <div className="flex flex-col">
          <TextLink
            link="/"
            spanStyle="text-center mt-4"
            linkStyle=" text-blue-500 hover:underline hover:text-blue-700"
            text="Back"
          />
        </div>
      </div>
    </div>
  );
}
