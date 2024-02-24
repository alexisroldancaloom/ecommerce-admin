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

        const { name, price, categoryId, materialId, sizeId, images, isFeatured, isArchived } = body;

        if (!userId) {
            return new NextResponse("Sin autenticar", { status: 403 });
        }

        if (!name) {
            return new NextResponse("El nombre es requerido", { status: 400 });
        }

        if (!images || !images.length) {
            return new NextResponse("Imágen requerida", { status: 400 });
        }

        if (!price) {
            return new NextResponse("Precio requerido", { status: 400 });
        }

        if (!categoryId) {
            return new NextResponse("La categoría es requerida", { status: 400 });
        }

        if (!materialId) {
            return new NextResponse("Material requerido", { status: 400 });
        }

        if (!sizeId) {
            return new NextResponse("Tamaño Requerido", { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("El id de la tienda es requerido", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Sin autorizar", { status: 405 });
        }

        const product = await prismadb.product.create({
            data: {
                name,
                price,
                isFeatured,
                isArchived,
                categoryId,
                materialId,
                sizeId,
                storeId: params.storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image),
                        ],
                    },
                },
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log('[PRODUCTS_POST]', error);
        return new NextResponse("Error interno", { status: 500 });
    }
};

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } },
) {
    try {
        const { searchParams } = new URL(req.url)
        const categoryId = searchParams.get('categoryId') || undefined;
        const materialId = searchParams.get('materialId') || undefined;
        const sizeId = searchParams.get('sizeId') || undefined;
        const isFeatured = searchParams.get('isFeatured');

        if (!params.storeId) {
            return new NextResponse("Id de la tienda requerido", { status: 400 });
        }

        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                materialId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false,
            },
            include: {
                images: true,
                category: true,
                material: true,
                size: true,
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        return NextResponse.json(products);
    } catch (error) {
        console.log('[PRODUCTS_GET]', error);
        return new NextResponse("Error interno", { status: 500 });
    }
};