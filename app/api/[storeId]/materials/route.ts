import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth();

        const body = await req.json();

        const { name, value } = body;

        if (!userId) {
            return new NextResponse("Sin autenticación", { status: 403 });
        }

        if (!name) {
            return new NextResponse("El nombre es requerido", { status: 400 });
        }

        if (!value) {
            return new NextResponse("El valor es requerido", { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("El Id de la tienda es requerido", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Sin autorización", { status: 405 });
        }

        const material = await prismadb.material.create({
            data: {
                name,
                value,
                storeId: params.storeId
            }
        });

        return NextResponse.json(material);
    } catch (error) {
        console.log('[MATERIALS_POST]', error);
        return new NextResponse("Error interno", { status: 500 });
    }
};

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        if (!params.storeId) {
            return new NextResponse("El id de la tienda es requerido", { status: 400 });
        }

        const materials = await prismadb.material.findMany({
            where: {
                storeId: params.storeId
            }
        });

        return NextResponse.json(materials);
    } catch (error) {
        console.log('[MATERIAL_GET]', error);
        return new NextResponse("Error Interno", { status: 500 });
    }
};