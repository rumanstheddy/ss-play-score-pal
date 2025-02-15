"use client";

import { useState } from "react";
import InputField from "@/components/InputField";
import PopUpMsg from "@/components/PopUpMsg";
import TextLink from "@/components/TextLink";
import { Button } from "@/components/ui/button";

export default function SignupView(): React.ReactElement {
  const [fName, setFname] = useState<string>("");
  const [lName, setLname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [displayPopUp, setDisplayPopUp] = useState<boolean>(false);
  const [signupSucess, setSignupSucess] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string>("");

  const successMsgStr: string = "You've registered successfully!";
  const diffPasswordsStr: string = "Passwords do not match!";

  interface Iuser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }

  const signUp = async (): Promise<Response> => {
    const userBody: Iuser = {
      firstName: fName,
      lastName: lName,
      email: email,
      password: password,
    };

    const res = await fetch("http://localhost:4000", {
      method: "POST",
      body: JSON.stringify({
        query: `mutation UserMutation($user: UserInput!) {
          signup(user : $user) {
            _id
            firstName
            lastName
            email
          }
        }`,
        variables: {
          user: userBody,
        },
      }),
      headers: { "Content-Type": "application/json" },
    });

    return res;
  };

  const clearFields = (): void => {
    setFname("");
    setLname("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const onSubmit = async () => {
    const response = await signUp();
    const data = await response.json();

    if (password !== confirmPassword) {
      setSignupSucess(false);
      setStatusMsg(diffPasswordsStr);
      setDisplayPopUp(true);
      clearFields();
      return;
    }

    if (data.errors) {
      setSignupSucess(false);
      setStatusMsg(data.errors[0].message as string);
    } else {
      setSignupSucess(true);
      setStatusMsg(successMsgStr);
    }

    setDisplayPopUp(true);

    clearFields();
  };

  const displayPopUpMsg = (): React.ReactElement =>
    displayPopUp ? (
      <PopUpMsg
        message={statusMsg}
        link="/login"
        setShouldDisplay={setDisplayPopUp}
        isSuccess={signupSucess}
      />
    ) : (
      <></>
    );

  return (
    <div className="flex justify-center min-h-screen">
      <div className="content-center w-1/3">
        {displayPopUpMsg()}
        <h1 className="scroll-m-20 pb-2 text-4xl font-semibold tracking-tight first:mt-0 text text-center">
          Sign Up
        </h1>
        <div className="flex flex-col mt-5">
          <InputField
            name="input_fName"
            label="First Name:"
            type="text"
            placeholder="Enter your First Name"
            input={fName}
            setInput={setFname}
          />
        </div>
        <div className="flex flex-col mt-4">
          <InputField
            name="input_lName"
            label="Last Name:"
            type="text"
            placeholder="Enter your Last Name"
            input={lName}
            setInput={setLname}
          />
        </div>
        <div className="flex flex-col mt-4">
          <InputField
            name="input_email"
            label="Email:"
            type="email"
            placeholder="Enter your email"
            input={email}
            setInput={setEmail}
          />
        </div>
        <div className="flex flex-col mt-4">
          <InputField
            name="input_pw"
            label="Password:"
            type="password"
            placeholder="Enter a password"
            input={password}
            setInput={setPassword}
          />
        </div>
        <div className="flex flex-col mt-4">
          <InputField
            name="input_confirm_pw"
            label="Confirm Password:"
            type="password"
            placeholder="Enter a password"
            input={confirmPassword}
            setInput={setConfirmPassword}
          />
        </div>
        <div className="flex justify-center mt-8">
          <Button
            className="rounded-lg bg-white py-3 px-6 text-center text-black text-md
            align-middle  hover:bg-slate-400"
            type="button"
            onClick={() => onSubmit()}
          >
            Sign Up
          </Button>
        </div>
        <div className="flex flex-col">
          <TextLink
            link="/"
            spanStyle="text-center mt-8"
            linkStyle=" text-blue-500 hover:underline hover:text-blue-700"
            text="Back"
          />
        </div>
      </div>
    </div>
  );
}
