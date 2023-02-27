import { Anybody } from "@next/font/google";
import { getTeams } from "../../neo4j/teams";
import { useRouter } from "next/router";


export default function Home() {
    const router = useRouter();
    let teamNumber = router.asPath.replace('/teams/', '');
    


    return <div>{teamNumber}</div>;
    // if (router.pathname === '1') {
    //     return <h1>This is page 1</h1>;
    //   } else if (router.pathname === '/2') {
    //     return <h1>This is page 2</h1>;
    //   } else {
    //     return <h1>This is some other page</h1>;
    //   }

}