"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";

const signin = () => {
  const router = useRouter();
  const email = useRef("");
  const password = useRef("");
  const [requiredError, setRequiredError] = useState({
    emailReq: false,
    passReq: false,
  });
  const handleSubmit = async (e?: React.FormEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault();
    }

    if (!email.current || !password.current) {
      setRequiredError({
        emailReq: email.current ? false : true,
        passReq: password.current ? false : true,
      });
      return;
    }
    const res = await signIn("credentials", {
      email: email.current,
      password: password.current,
      redirect: false,
    });

    if (!res?.error) {
      router.push("/");
    } else {
      //   toast("Error Signing in", {
      //     action: {
      //       label: "Close",
      //       onClick: () => toast.dismiss(),
      //     },
      //   });
    }
  };
  return (
    <div>
      <input
        onChange={(e) => (email.current = e.target.value)}
        type="text"
        placeholder="enter email id"
      />
      <input
        onChange={(e) => (password.current = e.target.value)}
        type="text"
        placeholder="enter password"
      />
      <button onClick={handleSubmit}>Login</button>
    </div>
  );
};

export default signin;
