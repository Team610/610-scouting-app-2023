import { SYSTEM_PROPS } from "@mantine/core/lib/Box/style-system-props/system-props/system-props";
import { Anybody } from "@next/font/google";
import Link from "next/link";
import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getMatch, getMatchList, getTeam } from "../../neo4j/Aggregate";
import { getTeams } from "../../neo4j/GetData";

export default function Home(this: any) {
  const [matches, setMatches] = useState<number[]>();
  const router = useRouter();
  let teamNumber = router.asPath.replace("/teams/", "");

  useEffect(() => {
    async function getData() {
      let data = await getMatchList(parseInt(teamNumber));
      console.log(data);
      setMatches(data);
    }

    getData();
  }, []);

  return (
    <div>
      <div style={{ border: "1px solid grey" }}>Team {teamNumber}</div>
      <div style={{ border: "1px solid grey" }}>Matches: </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {matches?.map((match) => {
          return (
            <div>
              <Link href={`${router.asPath}/${match}`}>{match}</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
