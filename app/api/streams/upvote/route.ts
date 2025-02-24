import { prismaClient } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

//@ts-ignore
import  {youtubesearchapi} from "youtube-search-api"
import { YT_REGEX } from "@/app/lib/utils";



//export const YT_REGEX=new RegExp("https://www.youtube.com/watch?v=irq70KO68Vg")



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

    const res=await youtubesearchapi.GetVideoDetails(extractedId)
    const thumbnails=res.thumbnail.thumbnails;
    thumbnails.sort((a:{width:number},b:{width:number}) => a.width < b.width ? -1:1);


    const stream=await prismaClient.activeStreams.create({
       data:{
        userId:data.creatorId ,
        url:data.url,
        extractedId,
        type:"Youtube",
        title:res.title ?? "video nhi mil rahi",
        smallImg:(thumbnails.length>1 ? thumbnails[thumbnails.length -2].url :thumbnails[thumbnails.length -1].url)
        ?? "https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://fdczvxmwwjwpwbeeqcth.supabase.co/storage/v1/object/public/images/a8bf1a2c-259e-4e95-b2c2-bb995876ed63/a252bcd6-9a10-40be-bf99-1d850d2026e4.png",
        bigImg:thumbnails[thumbnails.length -1].url 
        ?? "https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://fdczvxmwwjwpwbeeqcth.supabase.co/storage/v1/object/public/images/a8bf1a2c-259e-4e95-b2c2-bb995876ed63/a252bcd6-9a10-40be-bf99-1d850d2026e4.png"
       }

    })

    return NextResponse.json({
      ...stream,
      hasUpvoted:false,
      upvotes:0
    })

    // Handle the valid data (e.g., save to the database)
    /*return NextResponse.json({
      message: "Stream added successfully",
      data,
    });*/
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


export async function GET(req:NextRequest){
  const creatorId=req.nextUrl.searchParams.get("creatorId");
  const streams= await prismaClient.activeStreams.findMany({
    where:{
      userId:creatorId ?? ""
    }
  })

  return NextResponse.json({
    streams
  })
}


