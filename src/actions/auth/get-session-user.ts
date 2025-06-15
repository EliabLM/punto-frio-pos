"use server"

import { PrismaClient } from "@/app/generated/prisma";
import { auth } from "@clerk/nextjs/server";


export async function getSessionUser() {
    try {
        const prisma = new PrismaClient();
        const { userId } = await auth();

        if (!userId) {
            return null;
        }

        const user = await prisma.user.findUnique({
            where: {
                clerkId: userId
            }
        })

        if (!user) return null;

        return user;
    } catch (error) {
        console.error("[GET_SESSION_USER", error);
        return null;
    }
}