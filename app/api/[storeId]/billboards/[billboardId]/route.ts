import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";


export async function GET(
    req: Request,
    { params }: { params: { billboardId: string } }
) {
    try {
        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: params.billboardId,

            }
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.log('[BILLBOARD_GET]', error);
        return new NextResponse("Error Interno", { status: 500 });
    }
};

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, billboardId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { label, imageUrl } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!label) {
            return new NextResponse("La etiqueta es requerida", { status: 400 });
        }
        if (!imageUrl) {
            return new NextResponse("La url de la imágen es requerida", { status: 400 });
        }

        if (!params.billboardId) {
            return new NextResponse("Billboard id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            }
        });
        if (!storeByUserId) {
            return new NextResponse("Sin autorización", { status: 405 });
        }

        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: params.billboardId,

            },
            data: {
                label, imageUrl
            }
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.log('[BILLBOARD_PATCH]', error);
        return new NextResponse("Error Interno", { status: 500 });
    }
};

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, billboardId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Sin autorización", { status: 403 });
        }

        if (!params.billboardId) {
            return new NextResponse("Billboard id es requerido", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            }
        });
        if (!storeByUserId) {
            return new NextResponse("Sin autorización", { status: 405 });
        }

        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id: params.billboardId,

            }
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.log('[BILLBOARD_DELETE]', error);
        return new NextResponse("Error Interno", { status: 500 });
    }
};