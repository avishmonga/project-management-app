"use client";

import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "~/constants";
import { cn } from "~/lib/utils";
import NavbarAuth from "./NavbarAuth";

const MobileNav = () => {
  const pathName = usePathname();
  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger>
          <Image
            src={"/icons/hamburger.svg"}
            width={36}
            height={36}
            alt="Hamburger"
            className="cursor-pointer sm:hidden"
          />
        </SheetTrigger>
        <SheetContent side={"left"} className="bg-dark-1 border-none">
          <div className="flex h-screen flex-col justify-between overflow-y-auto">
            <SheetClose asChild>
              <div>
                <NavbarAuth isInMenu />

                <section className="flex h-full flex-col gap-6 pt-16 text-white ">
                  {sidebarLinks.map((link) => {
                    const isActive =
                      pathName === link.route ||
                      pathName.startsWith(`${link.route}/`);
                    return (
                      <SheetClose asChild key={link.route}>
                        <Link
                          href={link.route}
                          key={link.label}
                          className={cn(
                            "flex w-full max-w-60 items-center gap-4 rounded-lg p-4",
                            {
                              "bg-blue-1": isActive,
                            },
                          )}
                        >
                          <Image
                            src={link.imgUrl}
                            alt={link.label}
                            width={20}
                            height={20}
                          />
                          <p className="font-semibold ">{link.label}</p>
                        </Link>
                      </SheetClose>
                    );
                  })}
                </section>
              </div>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
