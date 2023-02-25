import { Anybody } from "@next/font/google";
import { getTeams } from "../neo4j/teams";


export default function Home({ data }: any) {
    // console.log(data);
    let element = [];
    for (let index = 0; index < data.length; index++) {
        element.push((<div  style={{border: "1px solid grey"}}>{data[index]}</div>))
    }
    return (
        <div>
            {element}
        </div>
    )

}

export async function getServerSideProps() {
    return { props: { data: await getTeams() } }
}