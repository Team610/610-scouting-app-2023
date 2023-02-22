import { getTeams } from "../neo4j/teams";


export default function Home(){
    console.log(getTeams());
}

export async function getServerSideProps(){
    let res = await getTeams();
    return {props: {}}
}