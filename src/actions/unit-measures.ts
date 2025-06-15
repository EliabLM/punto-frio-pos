'use server';

import { prisma } from "@/lib/prisma"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const unitMeasureSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    abbreviation: z.string().min(1, "La abreviación es requerida"),
})

export async function getUnitMeasures() {
    const { userId } = await auth();
    if (!userId) throw new Error("No autorizado");

    const user = (await clerkClient()).users.getUser(userId);
    const tenantId = (await user).privateMetadata.tenantId as string;

    const unitMeasures = await prisma.unitMeasure.findMany({
        where: {
            tenantId: tenantId,
            isDeleted: false,
        },
        orderBy: {
            name: "asc",
        },
    })

    return unitMeasures
}

export async function createUnitMeasure(data: z.infer<typeof unitMeasureSchema>) {
    const { userId } = await auth();
    if (!userId) throw new Error("No autorizado");

    const user = (await clerkClient()).users.getUser(userId);
    const tenantId = (await user).privateMetadata.tenantId as string;
    console.log('tenantId', tenantId);

    const validatedData = unitMeasureSchema.parse(data)
    console.log('data', validatedData);

    const unitMeasure = await prisma.unitMeasure.create({
        data: {
            ...validatedData,
            tenantId: tenantId,
        },
    })

    revalidatePath("/parametrizacion/unidades")
    return unitMeasure
}

export async function updateUnitMeasure(
    id: string,
    data: z.infer<typeof unitMeasureSchema>
) {
    const { userId } = await auth();
    if (!userId) throw new Error("No autorizado");

    const user = (await clerkClient()).users.getUser(userId);
    const tenantId = (await user).privateMetadata.tenantId as string;

    const validatedData = unitMeasureSchema.parse(data)

    const unitMeasure = await prisma.unitMeasure.update({
        where: {
            id,
            tenantId: tenantId,
        },
        data: validatedData,
    })

    revalidatePath("/parametrizacion/unidades")
    return unitMeasure
}

export async function deleteUnitMeasure(id: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("No autorizado");

    const user = (await clerkClient()).users.getUser(userId);
    const tenantId = (await user).privateMetadata.tenantId as string;

    const unitMeasure = await prisma.unitMeasure.update({
        where: {
            id,
            tenantId: tenantId,
        },
        data: {
            isDeleted: true,
            deletedAt: new Date(),
        },
    })

    revalidatePath("/parametrizacion/unidades")
    return unitMeasure
} 