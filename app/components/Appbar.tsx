import { Music } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";


export default function Appbar(){

    const session=useSession();
    return <div>
        <Link className="flex items-center justify-center" href="#">
          <Music className="h-6 w-6 mr-2" />
          <span className="font-bold">FanTune</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
              Features
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#how-it-works">
              How It Works
            </Link>
            {session.data?.user && <button className="m-2 p-2 bg-blue-400"  onClick={()=>signOut()}>LogOut</button> }  
            {!session.data?.user && <button className="m-2 p-2 bg-blue-400"  onClick={()=>signIn()}>SignIn</button> }

        </nav>

    </div>
}