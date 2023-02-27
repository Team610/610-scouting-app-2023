import { Anybody } from "@next/font/google";
import { getTeams } from "../neo4j/teams";
import { useRouter } from 'next/router'

export default function Home({ data }: any) {
    const router = useRouter();
    let element = [];
    element.push(<div style={{ border: "1px solid grey" }}>Teams</div>);
    for (let index = 0; index < data.length; index++) {
        element.push((
            <div style={{ border: "1px solid grey" }}>
                <button onClick={() => router.push('/teams/'+data[index])}>{data[index]}</button>
            </div>
        ))
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
