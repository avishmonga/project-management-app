"use client";

import { useRef, useState } from "react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
export default function SignUpForm() {
  const router = useRouter();
  const mutation = api.user.signup.useMutation();

  const email = useRef("");
  const password = useRef("");
  const name = useRef("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [requiredError, setRequiredError] = useState({
    emailReq: false,
    passReq: false,
    nameReq: false,
  });

  function togglePasswordVisibility() {
    setIsPasswordVisible((prevState: any) => !prevState);
  }
  const handleSubmit = async () => {
    let _email = email.current;
    let _password = password.current;
    let _name = name.current;
    if (_email && _password) {
      const response = await mutation.mutate({
        email: _email,
        password: _password,
        name: _name,
      });
    }
  };
  return (
    <section className="flex  justify-center  ">
      <div className="flex h-[calc(100vh-250px)] w-full max-w-[600px] flex-col items-center justify-center gap-6 overflow-auto  text-slate-200">
        <h1 className=" font-semibold">Create an account</h1>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col gap-4">
            <Label htmlFor="name">Name</Label>
            <Input
              name="name"
              id="name"
              placeholder="Enter your name"
              onChange={(e) => {
                setRequiredError((prevState) => ({
                  ...prevState,
                  nameReq: false,
                }));
                name.current = e.target.value;
              }}
            />
            {requiredError.nameReq && (
              <span className=" text-red-500">Name is required</span>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              id="email"
              placeholder="Enter your email"
              onChange={(e) => {
                setRequiredError((prevState) => ({
                  ...prevState,
                  emailReq: false,
                }));
                email.current = e.target.value;
              }}
            />
            {requiredError.emailReq && (
              <span className=" text-red-500">Email is required</span>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <Label>Password</Label>
            <div className="flex rounded-lg border">
              <Input
                className="border-0"
                name="password"
                type={isPasswordVisible ? "text" : "password"}
                id="password"
                placeholder="••••••••"
                onChange={(e) => {
                  setRequiredError((prevState) => ({
                    ...prevState,
                    passReq: false,
                  }));
                  password.current = e.target.value;
                }}
              />
              <button
                className="inset-y-0 right-0 flex items-center px-4 text-gray-600"
                onClick={togglePasswordVisibility}
              >
                {isPasswordVisible ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {requiredError.passReq && (
              <span className=" text-red-500">Password is required</span>
            )}
          </div>
        </div>
        <Button
          className="bg-dark-1 hover:bg-dark-2 my-3 w-full"
          onClick={handleSubmit}
        >
          Signup
        </Button>
        <div className="flex w-full justify-end">
          <Button onClick={() => router.push("/signin")} variant={"link"}>
            Login
          </Button>
        </div>
      </div>
    </section>
  );
}
