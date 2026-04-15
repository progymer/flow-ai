import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        const user = session?.user;
        if(!user) throw new Error("Unauthorized")

        const workflows = await prisma.workflow.findMany({
            where: { userId: user.id},
            select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "desc"
            }
        })  
        
        return NextResponse.json({
            success: true,
            data: workflows,
        })

    } catch (error) {
        console.error(error);
        return NextResponse.json(
          {
            error: "Failed to fetch workflow",
          },
          {
            status: 500,
          },
        );
    }
}

export async function POST(req: Request) {
    try {
        const { name, description } = await req.json();
        const session = await auth.api.getSession({ headers: await headers() });
        const user = session?.user;

        if(!user) throw new Error("Unauthorized")
        if (!name) throw new Error("Name field required");

        const userId = user.id

        const workflow = await prisma.workflow.create({
            data: {
                userId,
                name,
                description: description || "",
                //flowObject
            }
        })

        return NextResponse.json({
            success: true,
            data: workflow
        })

    } catch (error) {
        console.error(error)
        return NextResponse.json({
          error: "Failed to create workflow"
        },{
            status: 500
        });
    }
}