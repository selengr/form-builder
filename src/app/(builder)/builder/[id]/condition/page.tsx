import { ConditionalSystem } from "@/templates/condition/ConditionalSystem";


export default function Page({params}:{params : {id:string} }) {
    return (
        <>
            <ConditionalSystem id={parseInt(params.id)}/>
        </>
    );
}

