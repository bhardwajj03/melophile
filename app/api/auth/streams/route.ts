import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const YT_REGEX=new RegExp("^https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})$")

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
    const isYt =YT_REGEX.test(data.url);
    if(!isYt){
        return NextResponse.json({
            message:"Wrong Url input",
        },{status:411})
    }



    const extractedId=data.url.split("?v=")[1];

    await prismaClient.activeStreams.create({
       data:{
        userId:data.creatorId ,
        url:data.url,
        extractedId,
        type:"Youtube"
       }

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
