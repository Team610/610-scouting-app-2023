import { getTeams } from "../neo4j/Teams";

export default function Teams() {
  return <div>Hi!</div>;
}

export async function getServerSideProps() {
  console.log(await getTeams());
  return { props: {} };
}
