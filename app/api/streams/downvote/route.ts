import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {z} from 'zod'

const UpvoteSchema=z.object({
    streamId:z.string(),

})

export async function POST(req:NextRequest){
    const session= await getServerSession() ;
    
    const user=await prismaClient.user.findFirst({
        where:{
            email:session?.user?.email ??""
        }
    });
    
    
    if (!user){
        return NextResponse.json({
            message:"Unauthenticated"
        },{status:403})
    }

    
    try{
        const data=UpvoteSchema.parse(await req.json());
        await prismaClient.upvote.delete({
            where:{
                userId_streamId:{
                    userId:user.id,
                    streamId:data.streamId
                }
            }
        }) ;

        return NextResponse.json({
          message:"Done!"
        })
        
        }catch (e) {
            // Handle validation or parsing errors
            if (e instanceof z.ZodError) {
              return NextResponse.json(
                {
                  message: "Error while upvoting",
                  errors: e.errors, // Provide detailed error information
                },
                { status: 411}
              );
            }
        
            // Handle other types of errors
            return NextResponse.json(
              {
                message: "Error Error Error",
              },
              { status: 500 }
            );
          }
}