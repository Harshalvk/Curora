"use client";

import {
  CoinsIcon,
  FolderOpen,
  HomeIcon,
  Layers2Icon,
  MenuIcon,
  ShieldCheckIcon,
  XIcon,
} from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const routes = [
  { href: "home", label: "Home", icon: HomeIcon },
  { href: "create-course", label: "Create course", icon: Layers2Icon },
  { href: "courses", label: "My courses", icon: FolderOpen },
];

const NavLinks = ({ onClick }: { onClick?: () => void }) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col p-2 gap-1">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={`/${route.href}`}
          onClick={onClick}
          className={`flex items-center gap-2 px-2 py-1 rounded-sm hover:bg-muted transition ${
            pathname.includes(route.href)
              ? "dark:bg-zinc-900 bg-zinc-100 font-semibold"
              : ""
          }`}
        >
          <route.icon size={15} />
          <p className="text-[14px]">{route.label}</p>
        </Link>
      ))}
    </div>
  );
};

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="relative h-full">
      <div className="md:hidden p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(true)}
        >
          <MenuIcon />
        </Button>
      </div>

      <div
        className={`absolute inset-y-0 left-0 z-50 w-64 shadow-md transform transition-transform duration-300 md:hidde border-r bg-white dark:bg-zinc-950 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(false)}
          >
            <XIcon />
          </Button>
        </div>
        <NavLinks onClick={() => setIsMobileOpen(false)} />
      </div>

      <div className="hidden md:block min-w-[200px] max-w-[200px] h-full border-r">
        <NavLinks />
      </div>
    </div>
  );
};

export default Sidebar;
