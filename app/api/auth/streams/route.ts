import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createStreamSchema = z.object({
  creatorId: z.string(),
  url: z
    .string()
    .refine((url) => url.includes("youtube") || url.includes("spotify"), {
      message: "URL must include 'youtube' or 'spotify'",
    }),
});

export async function POST(req: NextRequest) {
  try {
    // Parse and validate the incoming data
    const data = createStreamSchema.parse(await req.json());
    prismaClient.activeStreams.create({
        userId:data.creatorId ,

    })

    // Handle the valid data (e.g., save to the database)
    return NextResponse.json({
      message: "Stream added successfully",
      data,
    });
  } catch (e) {
    // Handle validation or parsing errors
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Validation error",
          errors: e.errors, // Provide detailed error information
        },
        { status: 411}
      );
    }

    // Handle other types of errors
    return NextResponse.json(
      {
        message: "Error while adding a stream",
      },
      { status: 500 }
    );
  }
}
