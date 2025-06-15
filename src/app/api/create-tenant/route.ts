// app/api/create-tenant/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        // Verificar autenticación con Clerk
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        const { clerkUserId, userData, tenantData } = body;

        // Verificar que el usuario autenticado coincida
        if (userId !== clerkUserId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Verificar si el subdominio ya existe
        const existingTenant = await prisma.tenant.findUnique({
            where: { subdomain: tenantData.subdomain }
        });

        if (existingTenant) {
            return NextResponse.json(
                { error: 'El subdominio ya está en uso' },
                { status: 400 }
            );
        }

        // Crear tenant y usuario en una transacción
        const result = await prisma.$transaction(async (tx) => {
            // 1. Crear el tenant
            const tenant = await tx.tenant.create({
                data: {
                    name: tenantData.companyName,
                    subdomain: tenantData.subdomain,
                    email: userData.primaryEmailAddress.emailAddress,
                    phone: tenantData.phone,
                    address: tenantData.address,
                    city: "",
                    department: "",
                    nit: tenantData.nit,
                }
            });

            // 2. Crear el usuario administrador
            const user = await tx.user.create({
                data: {
                    tenantId: tenant.id,
                    email: userData.primaryEmailAddress.emailAddress,
                    username: userData.username,
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    clerkId: clerkUserId, // Referencia a Clerk
                }
            });

            // 3. Crear configuraciones iniciales del sistema
            await tx.systemConfig.createMany({
                data: [
                    {
                        tenantId: tenant.id,
                        key: 'company_name',
                        value: tenantData.companyName,
                        type: 'STRING'
                    },
                    {
                        tenantId: tenant.id,
                        key: 'next_invoice_number',
                        value: '1',
                        type: 'NUMBER'
                    },
                    {
                        tenantId: tenant.id,
                        key: 'invoice_prefix',
                        value: tenant.subdomain.toUpperCase(),
                        type: 'STRING'
                    },
                    {
                        tenantId: tenant.id,
                        key: 'currency',
                        value: 'COP',
                        type: 'STRING'
                    },
                    {
                        tenantId: tenant.id,
                        key: 'overdue_days',
                        value: '30',
                        type: 'NUMBER'
                    }
                ]
            });

            // 4. Crear métodos de pago por defecto
            await tx.paymentMethod.createMany({
                data: [
                    {
                        tenantId: tenant.id,
                        name: 'Efectivo',
                        type: 'CASH'
                    },
                    {
                        tenantId: tenant.id,
                        name: 'Tarjeta de Crédito',
                        type: 'CARD'
                    },
                    {
                        tenantId: tenant.id,
                        name: 'Transferencia Bancaria',
                        type: 'TRANSFER'
                    }
                ]
            });

            // 5. Crear unidades de medida por defecto
            await tx.unitMeasure.createMany({
                data: [
                    {
                        tenantId: tenant.id,
                        name: 'Unidad',
                        abbreviation: 'UN'
                    },
                    {
                        tenantId: tenant.id,
                        name: 'Litro',
                        abbreviation: 'L'
                    },
                    {
                        tenantId: tenant.id,
                        name: 'Botella',
                        abbreviation: 'BOT'
                    },
                    {
                        tenantId: tenant.id,
                        name: 'Caja',
                        abbreviation: 'CJ'
                    }
                ]
            });

            // 6. Crear categorías por defecto
            await tx.category.createMany({
                data: [
                    {
                        tenantId: tenant.id,
                        name: 'Whisky',
                        description: 'Whisky nacional e importado'
                    },
                    {
                        tenantId: tenant.id,
                        name: 'Ron',
                        description: 'Ron nacional e importado'
                    },
                    {
                        tenantId: tenant.id,
                        name: 'Vodka',
                        description: 'Vodka nacional e importado'
                    },
                    {
                        tenantId: tenant.id,
                        name: 'Cerveza',
                        description: 'Cervezas nacionales e importadas'
                    },
                    {
                        tenantId: tenant.id,
                        name: 'Vino',
                        description: 'Vinos nacionales e importados'
                    }
                ]
            });

            return { tenant, user };
        });

        (await clerkClient()).users.updateUserMetadata(clerkUserId, {
            privateMetadata: {
                tenantId: result.tenant.id
            }
        });

        return NextResponse.json({
            success: true,
            tenantId: result.tenant.id,
            message: 'Empresa creada exitosamente'
        });

    } catch (error) {
        console.error('Error creating tenant:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}