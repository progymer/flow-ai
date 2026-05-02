import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Edge, Node } from "@xyflow/react";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: await headers() });
    const user = session?.user;
    if (!user) throw new Error("Unauthorized");

    const workflow = await prisma.workflow.findUnique({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!workflow) {
      return NextResponse.json(
        {
          error: "Workflow not found",
        },
        { status: 404 },
      );
    }

    const flowObject = JSON.parse(workflow.flowObject);

    return NextResponse.json({
      success: true,
      data: {
        id: workflow.id,
        name: workflow.name,
        flowObject: flowObject,
      },
    });
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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: await headers() });
    const user = session?.user;
    if (!user) throw new Error("Unauthorized");

    const workflow = await prisma.workflow.findUnique({
      where: { id, userId: user.id },
    });

    if (!workflow) {
      return NextResponse.json(
        { error: "Workflow not found" },
        { status: 404 },
      );
    }

    await prisma.workflow.delete({
      where: { id, userId: user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete workflow" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { nodes, edges } = (await req.json()) as {
      nodes: Node[];
      edges: Edge[];
    }
    const session = await auth.api.getSession({ headers: await headers() });
    const user = session?.user;
    if (!user) throw new Error("Unauthorized");

    const workflow = await prisma.workflow.findUnique({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!workflow) {
      return NextResponse.json(
        {
          error: "Workflow not found",
        },
        { status: 404 },
      );
    }

    const updatedWorkflow = await prisma.workflow.update({
      where: { id },
      data: {
        flowObject: JSON.stringify({ nodes, edges })
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: updatedWorkflow.id,
        name: updatedWorkflow.name,
        flowObject: JSON.parse(updatedWorkflow.flowObject)
      }
    })

    
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Failed to update workflow",
      },
      {
        status: 500,
      },
    );
  }
}