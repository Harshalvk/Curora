import { auth } from "@/auth";
import Logo from "@/components/Logo";
import { ModeToggle } from "@/components/ModeToggle";
import React from "react";
import { UserToogle } from "./UserAvatar";

const Navbar = async () => {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return <p className="border-b">User not found</p>;
  }

  return (
    <nav className="p-2 border-b flex items-center justify-between">
      <Logo />
      <div className="flex items-center gap-4">
        <ModeToggle />
        <UserToogle user={user} />
      </div>
    </nav>
  );
};

export default Navbar;
