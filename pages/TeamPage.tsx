import { Anybody } from "@next/font/google";
import { useRouter } from "next/router";
// import { getTeams } from "../neo4j/teams";

export default function Home({ data }: any) {
  // const router = useRouter();
  // let element = [];
  // element.push(<div style={{ border: "1px solid grey" }}>Teams</div>);
  // for (let index = 0; index < data.length; index++) {
  //   element.push(
  //     <div style={{ border: "1px solid grey" }}>
  //       <button onClick={() => router.push("/teams/" + data[index])}>
  //         {data[index]}
  //       </button>
  //     </div>
  //   );
  // }
  return <div></div>;
}

export async function getServerSideProps() {
  // return { props: { data: await getTeams() } };
}
