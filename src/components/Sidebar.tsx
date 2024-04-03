"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { sidebarLinks } from "~/constants";
import { cn } from "~/lib/utils";

const Sidebar = () => {
  const pathName = usePathname();
  return (
    <div className="bg-dark-1 sticky left-0 top-0 flex h-screen w-fit flex-col justify-between p-6 pt-28 text-white max-sm:hidden lg:w-[264px]">
      <div className="flex flex-1 flex-col gap-6">
        {sidebarLinks.map((link) => {
          const isActive =
            pathName === link.route || pathName.startsWith(`${link.route}/`);
          return (
            <Link
              href={link.route}
              key={link.label}
              className={cn(
                "flex items-center justify-start gap-4 rounded-lg p-4",
                { "bg-blue-1": isActive },
              )}
            >
              <Image
                src={link.imgUrl}
                alt={link.label}
                width={24}
                height={24}
                style={{ filter: "invert(1)" }}
              />
              <p className="text-lg font-semibold max-lg:hidden">
                {link.label}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
