"use client"

import { Music } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button"

export default function Appbar(){

    const session=useSession();
    return( 
    <div >
      <Link className="flex items-center justify-center p-4" href="/dashboard">
          <Music className="h-6 w-6 mr-2" />
          <span className="font-bold">Melophile</span>
      </Link>
       <div className="absolute top-4 right-4">
            {session.data?.user && <Button className="m-2 p-2 bg-blue-500"  onClick={()=>signOut()}>LogOut</Button> }  
            {!session.data?.user && <Button className="m-2 p-2 bg-blue-500"  onClick={()=>signIn()}>SignIn</Button> }
       </div>
    </div>
    )
}