import {Avatar, Button} from '@mantine/core';
import { getSession, useSession, signIn } from "next-auth/react";

export default function SignIn(){

    const { data: session, status } = useSession()

    if(session){
        console.log(session)
        return <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <Avatar src={session.user?.image} />
            <p>{session.user?.name}</p>
        </div>
    }
    
    return(
        <Button variant="default" onClick={() => signIn("google")}>Sign In</Button>
    )

}

export async function getServerSideProps(){

    const session = await getSession()

    if (!session) return {props: {}}

    return {redirect: {permanent: false, destination: "/"}}

}