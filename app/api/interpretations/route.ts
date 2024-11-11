import client from "@/app/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

// Create interpretation
async function createInterpretation(data: {
  term: string;
  interpretation: string;
}) {
  try {
    const response = await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_IDS as string,
      "interpretations",
      ID.unique(),
      data
    );
    return response;
  } catch (error) {
    console.log("Error creating interpretation", error);
    throw new Error("Failed to create interpretation");
  }
}

// Fetch interpratation
async function fetchInterpretation() {
  try {
    const response = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_IDS as string,
      "interpretations",
      [Query.orderDesc("$createdAt")]
    );
    return response.documents;
  } catch (error) {
    console.log("Error Fetching interpretation", error);
    throw new Error("Failed to fetch interpretation");
  }
}

export async function POST(req: Request) {
  try {
    const { term, interpretation } = await req.json();
    const data = { term, interpretation };
    const response = await createInterpretation(data);
    return NextResponse.json({ message: "Interpretation Created" });
  } catch (error) {
    return NextResponse.json(
      {
        error: "failed to create interpretation",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const interpratations = await fetchInterpretation();
    return NextResponse.json(interpratations);
  } catch (error) {
    return NextResponse.json(
      {
        error: "failed to fetch interpretations",
      },
      { status: 500 }
    );
  }
}
