"use server";

import { auth } from "@/auth";
import { symmetricEncrypt } from "@/lib/encryption";
import { prisma } from "@/lib/prisma";

export default async function UpdateUserApiKey(apiKey: string) {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("Unauthenticated");
    }

    const hashApi = symmetricEncrypt(apiKey);

    const api = await prisma.user.update({
      where: {
        id: session.user?.id,
      },
      data: {
        apiKey: hashApi,
      },
    });

    if (!api) {
      throw new Error(`Api Key not updated`);
    }

    return { success: true };
  } catch (error: any) {
    console.log("Error by fetching course by ID: ", error);
    return { success: false, message: error.message };
  }
}
