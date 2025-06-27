import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import React from "react";
import ApiKeyPageContent from "./_components/ApiKeyPageContent";
import bcrypt from "bcryptjs";
import { symmetricDecrypt } from "@/lib/encryption";

const ApiKeyPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findFirst({
    where: {
      id: session.user.id,
    },
    select: {
      apiKey: true,
    },
  });

  const decodedApi = user?.apiKey ? symmetricDecrypt(user.apiKey) : null;

  return <ApiKeyPageContent apiKey={decodedApi} />;
};

export default ApiKeyPage;
