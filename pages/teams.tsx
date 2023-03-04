import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getTeams } from "../neo4j/GetData";

export default function Home() {
  const router = useRouter();
  const [teams, setTeams] = useState<string[]>();
  useEffect(() => {
    async function fetchTeams() {
      setTeams(await getTeams());
    }
    fetchTeams();
  }, []);
  return (
    <div>
      <div style={{ border: "1px solid grey" }}>Teams</div>
      {teams
        ? teams.map((team: string) => {
            return (
              <div style={{ border: "1px solid grey" }}>
                <button onClick={() => router.push("/teams/" + team)}>
                  {team}
                </button>
              </div>
            );
          })
        : null}
    </div>
  );
}
