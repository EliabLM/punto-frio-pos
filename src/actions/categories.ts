'use server';

import { prisma } from "@/lib/prisma"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const categorySchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    description: z.string().optional(),
})

export async function getCategories() {
    const { userId } = await auth();
    if (!userId) throw new Error("No autorizado");

    const user = (await clerkClient()).users.getUser(userId);
    const tenantId = (await user).privateMetadata.tenantId as string;

    const categories = await prisma.category.findMany({
        where: {
            tenantId: tenantId,
            isDeleted: false,
        },
        orderBy: {
            name: "asc",
        },
    })

    return categories
}

export async function createCategory(data: z.infer<typeof categorySchema>) {
    const { userId } = await auth();
    if (!userId) throw new Error("No autorizado");

    const user = (await clerkClient()).users.getUser(userId);
    const tenantId = (await user).privateMetadata.tenantId as string;

    const validatedData = categorySchema.parse(data)

    const category = await prisma.category.create({
        data: {
            ...validatedData,
            tenantId: tenantId,
        },
    })

    revalidatePath("/parametrizacion/categorias")
    return category
}

export async function updateCategory(
    id: string,
    data: z.infer<typeof categorySchema>
) {
    const { userId } = await auth();
    if (!userId) throw new Error("No autorizado");

    const user = (await clerkClient()).users.getUser(userId);
    const tenantId = (await user).privateMetadata.tenantId as string;

    const validatedData = categorySchema.parse(data)

    const category = await prisma.category.update({
        where: {
            id,
            tenantId: tenantId,
        },
        data: validatedData,
    })

    revalidatePath("/parametrizacion/categorias")
    return category
}

export async function deleteCategory(id: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("No autorizado");

    const user = (await clerkClient()).users.getUser(userId);
    const tenantId = (await user).privateMetadata.tenantId as string;

    const category = await prisma.category.update({
        where: {
            id,
            tenantId: tenantId,
        },
        data: {
            isDeleted: true,
            deletedAt: new Date(),
        },
    })

    revalidatePath("/parametrizacion/categorias")
    return category
} 