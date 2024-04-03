import Image from "next/image";
import Link from "next/link";
import React from "react";
import MobileNav from "./MobileNav";
import { Button } from "./ui/button";
import NavbarAuth from "./NavbarAuth";

const Navbar = () => {
  return (
    <nav className="flex-between bg-dark-1 fixed z-50 w-full px-6 py-4 lg:px-10">
      <Link href={"/"} className="flex items-center gap-1">
        <Image
          src={"/icons/logo.svg"}
          alt="Logo"
          width={60}
          height={60}
          className="max-sm:size-10"
        />
      </Link>
      <div className="flex-between gap-5">
        <div className="max-sm:hidden">
          <NavbarAuth />
        </div>
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
