import { getSession, useSession, signIn } from "next-auth/react";

export default function SignIn(){

    const { data: session, status } = useSession()

    if(session){
        return <>
        </>
    }
    
    return(
        <button onClick={() => signIn("google")}>Sign In</button>
    )

}

export async function getServerSideProps(){

    const session = await getSession()

    if (!session) return {props: {}}

    return {redirect: {permanent: false, destination: "/"}}

}