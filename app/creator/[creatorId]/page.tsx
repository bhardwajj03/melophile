
export default function creator({
    params:{
        creatorId
    }
}:{
    params:{
        creatorId:string;
    }
}){
    return <div>
        {creatorId}
    </div>
}