import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"
export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const body = await req.json()
        const { name } = body

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        if (!name) {
            return new NextResponse("El nombre es requerido", { status: 400 })
        }
        const store = await prismadb.store.create({
            data: {
                name, userId
            }
        })
        return NextResponse.json(store)
    }
    catch (error) {
        // Folder store POST METHOD
        console.log('[STORES_POST]', error)
        return new NextResponse("Error interno", { status: 500 })
    }
}