"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "next-auth";
import Image from "next/image";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

type Props = {
  user: Pick<User, "name" | "image" | "email">;
};

export function UserToogle({ user }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-[4px] flex items-center gap-1 rounded-sm border hover:bg-zinc-900 transition-all">
        <p className="text-xs font-semibold">{user.name}</p>
        <UserAvatar user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white dark:bg-zinc-950" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-zinc-700 dark:text-zinc-400">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={"/"}>Home</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            signOut().catch(console.error);
          }}
          className="text-red-800 cursor-pointer dark:text-red-500"
        >
          Sign out <LogOut height={16} width={16} className="ml-2" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserAvatar({ user }: Props) {
  return (
    <Avatar>
      {user.image ? (
        <div className="w-full h-full aspect-square">
          <Image
            src={user.image}
            alt={"user profile"}
            height={40}
            width={40}
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user.name}</span>
        </AvatarFallback>
      )}
    </Avatar>
  );
}
