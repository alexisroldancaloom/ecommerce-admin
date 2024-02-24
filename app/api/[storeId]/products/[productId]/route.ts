import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
    req: Request,
    { params }: { params: { productId: string } }
) {
    try {
        if (!params.productId) {
            return new NextResponse("Id de producto requerido", { status: 400 });
        }

        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId
            },
            include: {
                images: true,
                category: true,
                size: true,
                material: true,
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log('[PRODUCT_GET]', error);
        return new NextResponse("Error Interno", { status: 500 });
    }
};

export async function DELETE(
    req: Request,
    { params }: { params: { productId: string, storeId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Sin autenticar", { status: 403 });
        }

        if (!params.productId) {
            return new NextResponse("Id de producto requerido", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Sin auorizar", { status: 405 });
        }

        const product = await prismadb.product.delete({
            where: {
                id: params.productId
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log('[PRODUCT_DELETE]', error);
        return new NextResponse("Error Interno", { status: 500 });
    }
};


export async function PATCH(
    req: Request,
    { params }: { params: { productId: string, storeId: string } }
) {
    try {
        const { userId } = auth();

        const body = await req.json();

        const { name, price, categoryId, images, materialId, sizeId, isFeatured, isArchived } = body;

        if (!userId) {
            return new NextResponse("Sin autenticar", { status: 403 });
        }

        if (!params.productId) {
            return new NextResponse("Id de producto requerido", { status: 400 });
        }

        if (!name) {
            return new NextResponse("Nombre Requerido", { status: 400 });
        }

        if (!images || !images.length) {
            return new NextResponse("ImageneS requeridas", { status: 400 });
        }

        if (!price) {
            return new NextResponse("Precio requerido", { status: 400 });
        }

        if (!categoryId) {
            return new NextResponse("Categoría requerida", { status: 400 });
        }

        if (!materialId) {
            return new NextResponse("Material requerido", { status: 400 });
        }

        if (!sizeId) {
            return new NextResponse("Tamaño requerido", { status: 400 });
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

        await prismadb.product.update({
            where: {
                id: params.productId
            },
            data: {
                name,
                price,
                categoryId,
                materialId,
                sizeId,
                images: {
                    deleteMany: {},
                },
                isFeatured,
                isArchived,
            },
        });

        const product = await prismadb.product.update({
            where: {
                id: params.productId
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image),
                        ],
                    },
                },
            },
        })

        return NextResponse.json(product);
    } catch (error) {
        console.log('[PRODUCT_PATCH]', error);
        return new NextResponse("Error interno", { status: 500 });
    }
};