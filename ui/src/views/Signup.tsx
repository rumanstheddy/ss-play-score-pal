"use client";

import { useState } from "react";
import InputField from "@/components/InputField";
import PopUpMsg from "@/components/PopUpMsg";
import TextLink from "@/components/TextLink";
import { Button } from "@/components/ui/button";
import { signup } from "@/providers/PlayScore/PlayScoreProvider";

export default function SignupView(): React.ReactElement {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [status, setStatus] = useState({
    message: "",
    success: false,
    displayPopup: false,
    link: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignup = async () => {
    if (form.password !== form.confirmPassword) {
      setStatus({
        message: "Passwords do not match!",
        success: false,
        displayPopup: true,
        link: "",
      });
      return;
    }

    try {
      const res = await signup({
        fields: "_id firstName lastName email",
        parameters: { $user: "UserInput!" },
        variables: { user: form },
      });

      if (res.errors) {
        const error = res.errors[0];
        setStatus({
          message: error.message,
          success: false,
          displayPopup: true,
          link:
            error.extensions?.code === "USER_ALREADY_EXISTS" ? "/login" : "",
        });
      } else {
        setStatus({
          message: "You've registered successfully!",
          success: true,
          displayPopup: true,
          link: "/login",
        });
      }
    } catch (error) {
      setStatus({
        message: "An unexpected error occurred. Please try again.",
        success: false,
        displayPopup: true,
        link: "",
      });
    } finally {
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <div className="flex justify-center min-h-screen">
      <div className="content-center w-1/3">
        {status.displayPopup && (
          <PopUpMsg
            message={status.message}
            link={status.link}
            setShouldDisplay={() =>
              setStatus((prev) => ({ ...prev, displayPopup: false }))
            }
            isSuccess={status.success}
          />
        )}
        <h1 className="text-4xl font-semibold text-center my-8 text-white">
          Sign Up
        </h1>
        <InputField
          name="input_fName"
          label="First Name:"
          type="text"
          input={form.firstName}
          setInput={(val) => handleChange("firstName", val)}
          placeholder="Enter your First Name"
        />
        <InputField
          name="input_lName"
          label="Last Name:"
          type="text"
          input={form.lastName}
          setInput={(val) => handleChange("lastName", val)}
          placeholder="Enter your Last Name"
        />
        <InputField
          name="input_email"
          label="Email:"
          type="email"
          input={form.email}
          setInput={(val) => handleChange("email", val)}
          placeholder="Enter your email"
        />
        <InputField
          name="input_pw"
          label="Password:"
          type="password"
          input={form.password}
          setInput={(val) => handleChange("password", val)}
          placeholder="Enter a password"
        />
        <InputField
          name="input_confirm_pw"
          label="Confirm Password:"
          type="password"
          input={form.confirmPassword}
          setInput={(val) => handleChange("confirmPassword", val)}
          placeholder="Enter a password"
        />
        <div className="flex justify-center mt-8">
          <Button
            className="bg-white text-black hover:bg-slate-400"
            onClick={handleSignup}
          >
            Sign Up
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
