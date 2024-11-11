import client from "@/app/lib/appwrite_client";
import { Databases } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

async function fetchInterpretation(id: string) {
  try {
    const interpretation = await database.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_IDS as string,
      "interpretations",
      id
    );
    return interpretation;
  } catch (error) {
    console.log("Error Fetching interpretation", error);
    throw new Error("Failed to fetch interpretation");
  }
}

// Updating Function
async function updateInterPretation(
  id: string,
  data: { term: string; interpretation: string }
) {
  try {
    const response = await database.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_IDS as string,
      "interpretations",
      id,
      data // Correctly passing data
    );
    return response;
  } catch (error) {
    console.error("Error updating interpretation:", error);
    throw new Error("Failed to update interpretation");
  }
}

// Delete a specific interpretation

async function deleteInterPretation(id: string) {
  try {
    const response = await database.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_IDS as string,
      "interpretations",
      id
    );
    return response;
  } catch (error) {
    console.error("Error deleting interpretation:", error);
    throw new Error("Failed to delete interpretation");
  }
}

// Delete a specific interpretation

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const interpretation = await fetchInterpretation(id);
    console.log(interpretation, "interpretation");
    return NextResponse.json({ interpretation });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch interpretation" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await deleteInterPretation(id);
    return NextResponse.json({ message: "Interpretation deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete interpretation" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const interpretation = await req.json();
    await updateInterPretation(id, interpretation);
    return NextResponse.json({ message: "Interpretation Updated" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update interpretation" },
      { status: 500 }
    );
  }
}
