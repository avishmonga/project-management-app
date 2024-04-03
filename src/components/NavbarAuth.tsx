"use client";

import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
//import { useRouter } from 'next/navigation';
import { Button } from "./ui/button";

const NavbarAuth = ({ isInMenu = false }: { isInMenu?: boolean }) => {
  const session = useSession();
  //const router = useRouter();

  return (
    <Button
      className=" text-slate-400 hover:text-slate-600"
      size={"sm"}
      variant={isInMenu ? "link" : "outline"}
      id="navbar-default"
      onClick={() => {
        if (session.data?.user) {
          signOut();
        } else {
          signIn();
        }
      }}
    >
      {session.data?.user ? "Logout" : "Login"}
    </Button>
  );
};
export default NavbarAuth;
