import { signIn, signOut, useSession } from "next-auth/react";


export default function Appbar(){

    const session=useSession();
    return <div>
        <div className="flex justify-between">
            <div>
                Melophile
        </div>
        <div > 
            {session.data?.user && <button className="m-2 p-2 bg-blue-400"  onClick={()=>signOut()}>LogOut</button> }  
            {!session.data?.user && <button className="m-2 p-2 bg-blue-400"  onClick={()=>signIn()}>SignIn</button> }
            
        </div>
    </div>
    </div>
}