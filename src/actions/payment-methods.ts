'use server';

import { prisma } from "@/lib/prisma"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { PaymentType } from "@/app/generated/prisma"

const paymentMethodSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    type: z.nativeEnum(PaymentType),
})

export async function getPaymentMethods() {
    const { userId } = await auth();
    if (!userId) throw new Error("No autorizado");

    const user = (await clerkClient()).users.getUser(userId);
    const tenantId = (await user).privateMetadata.tenantId as string;

    const paymentMethods = await prisma.paymentMethod.findMany({
        where: {
            tenantId: tenantId,
            isDeleted: false,
        },
        orderBy: {
            name: "asc",
        },
    })

    return paymentMethods
}

export async function createPaymentMethod(data: z.infer<typeof paymentMethodSchema>) {
    const { userId } = await auth();
    if (!userId) throw new Error("No autorizado");

    const user = (await clerkClient()).users.getUser(userId);
    const tenantId = (await user).privateMetadata.tenantId as string;

    const validatedData = paymentMethodSchema.parse(data)

    const paymentMethod = await prisma.paymentMethod.create({
        data: {
            ...validatedData,
            tenantId: tenantId,
        },
    })

    revalidatePath("/parametrizacion/metodos-pago")
    return paymentMethod
}

export async function updatePaymentMethod(
    id: string,
    data: z.infer<typeof paymentMethodSchema>
) {
    const { userId } = await auth();
    if (!userId) throw new Error("No autorizado");

    const user = (await clerkClient()).users.getUser(userId);
    const tenantId = (await user).privateMetadata.tenantId as string;

    const validatedData = paymentMethodSchema.parse(data)

    const paymentMethod = await prisma.paymentMethod.update({
        where: {
            id,
            tenantId: tenantId,
        },
        data: validatedData,
    })

    revalidatePath("/parametrizacion/metodos-pago")
    return paymentMethod
}

export async function deletePaymentMethod(id: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("No autorizado");

    const user = (await clerkClient()).users.getUser(userId);
    const tenantId = (await user).privateMetadata.tenantId as string;

    const paymentMethod = await prisma.paymentMethod.update({
        where: {
            id,
            tenantId: tenantId,
        },
        data: {
            isDeleted: true,
            deletedAt: new Date(),
        },
    })

    revalidatePath("/parametrizacion/metodos-pago")
    return paymentMethod
} 