import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function GET(
    req: Request,
    { params }: { params: { materialId: string } }
) {
    try {
        if (!params.materialId) {
            return new NextResponse("El ID de el material es requerido", { status: 400 });
        }

        const material = await prismadb.material.findUnique({
            where: {
                id: params.materialId
            }
        });

        return NextResponse.json(material);
    } catch (error) {
        console.log('[MATERIAL_GET]', error);
        return new NextResponse("Error Interno", { status: 500 });
    }
};

export async function DELETE(
    req: Request,
    { params }: { params: { materialId: string, storeId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Sin autenticación", { status: 403 });
        }

        if (!params.materialId) {
            return new NextResponse("El Id del tamaño es requerido", { status: 400 });
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

        const material = await prismadb.material.delete({
            where: {
                id: params.materialId
            }
        });

        return NextResponse.json(material);
    } catch (error) {
        console.log('[MATERIAL_DELETE]', error);
        return new NextResponse("Error Interno", { status: 500 });
    }
};


export async function PATCH(
    req: Request,
    { params }: { params: { materialId: string, storeId: string } }
) {
    try {
        const { userId } = auth();

        const body = await req.json();

        const { name, value } = body;

        if (!userId) {
            return new NextResponse("Sin autenticación", { status: 403 });
        }

        if (!name) {
            return new NextResponse("Nombre requerido", { status: 400 });
        }

        if (!value) {
            return new NextResponse("El valor es requerido", { status: 400 });
        }


        if (!params.materialId) {
            return new NextResponse("El Id de el tamaño es requerido", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Sin autorización ", { status: 405 });
        }

        const material = await prismadb.material.update({
            where: {
                id: params.materialId
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(material);
    } catch (error) {
        console.log('[MATERIAL_PATCH]', error);
        return new NextResponse("Error interno", { status: 500 });
    }
};