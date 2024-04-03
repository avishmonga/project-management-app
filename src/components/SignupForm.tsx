"use client";

import { FormEvent } from "react";
import { api } from "~/utils/api";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
export default function SignUpForm() {
  const router = useRouter();
  const mutation = api.user.signup.useMutation();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let email = (formData.get("email") as string) || "";
    let password = (formData.get("password") as string) || "";
    if (email && password) {
      const response = await mutation.mutate({
        email,
        password,
      });
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-10 flex max-w-md flex-col gap-2"
    >
      <input
        name="email"
        className="border border-black text-black"
        type="email"
        placeholder="Enter your email address"
      />
      <input
        name="password"
        className="border border-black  text-black"
        type="password"
        placeholder="Enter your password"
      />
      <button type="submit">Register</button>
    </form>
  );
}
