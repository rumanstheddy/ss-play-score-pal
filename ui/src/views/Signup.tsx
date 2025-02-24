"use client";

import { useState } from "react";
import InputField from "@/components/InputField";
import PopUpMsg from "@/components/PopUpMsg";
import TextLink from "@/components/TextLink";
import { Button } from "@/components/ui/button";
import { signup } from "@/providers/PlayScore/PlayScoreProvider";

export default function SignupView(): React.ReactElement {
  const [fName, setFname] = useState<string>("");
  const [lName, setLname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [displayPopUp, setDisplayPopUp] = useState<boolean>(false);
  const [signupSucess, setSignupSucess] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string>("");
  const [link, setLink] = useState("");

  const successMsgStr: string = "You've registered successfully!";
  const diffPasswordsStr: string = "Passwords do not match!";

  interface Iuser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }

  type SignupError = {
    message: string;
    extensions: Record<string, string>;
  };

  const signUp = async () => {
    const userBody: Iuser = {
      firstName: fName,
      lastName: lName,
      email: email,
      password: password,
    };

    const res = await signup({
      fields: "_id firstName lastName email",
      parameters: { $user: "UserInput!" },
      variables: {
        user: userBody,
      },
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
    if (password !== confirmPassword) {
      handleSignupError(diffPasswordsStr);
      return;
    }

    try {
      const data = await signUp();

      if (data.errors) {
        const error: SignupError = data.errors[0];
        const link =
          error.extensions.code === "USER_ALREADY_EXISTS" ? "/login" : "";
        handleSignupError(error.message, link);
      } else {
        handleSignupSuccess(successMsgStr, "/login");
      }
    } catch (err) {
      console.error("Signup failed:", err);
      handleSignupError("An unexpected error occurred. Please try again.");
    } finally {
      clearFields();
    }
  };

  const handleSignupError = (message: string, link?: string) => {
    setSignupSucess(false);
    setStatusMsg(message);
    setLink(link ?? "");
    setDisplayPopUp(true);
  };

  const handleSignupSuccess = (message: string, link: string) => {
    setSignupSucess(true);
    setStatusMsg(message);
    setLink(link);
    setDisplayPopUp(true);
  };

  return (
    <div className="flex justify-center min-h-screen">
      <div className="content-center w-1/3">
        {displayPopUp ? (
          <PopUpMsg
            message={statusMsg}
            link={link}
            setShouldDisplay={setDisplayPopUp}
            isSuccess={signupSucess}
          />
        ) : (
          <></>
        )}
        <h1 className="scroll-m-20 pb-2 text-4xl font-semibold tracking-tight first:mt-0 text text-center mt-12">
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
