import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  getMatchList,
  calculateTeamAgg,
  getTeamAgg,
  getPiecesByLevel,
} from "../../neo4j/Aggregate";
import { teamAggData } from "../../utils";
import { SingleTeamData } from "../data";
import Image from "next/image";
import Chart from "../../components/matchChart";
import { StatsRing } from "../../components/statBox";

export default function Home() {
  const [matches, setMatches] = useState<string[]>();
  const [agg, setAgg] = useState<teamAggData>();
  const [img, setImage] = useState("");
  const router = useRouter();
  let teamNumber: string = router.asPath.replace("/teams/", "");

  useEffect(() => {
    async function getData() {
      let data = await getMatchList(parseInt(teamNumber));
      let teamAgg = await getTeamAgg({ team: parseInt(teamNumber) });
      console.log(teamAgg);
      setMatches(data);
      setAgg(teamAgg);
      console.log(await getPiecesByLevel(parseInt(teamNumber)));
    }

    async function getImage() {
      const headers = {
        "X-TBA-Auth-Key":
          "monpiIlPoQ81Y5bc8zhoMNuTbm8bLHQzYikSQuYYZHvM3BbAm8Y4uFeaOU6bMNg1",
      };
      try {
        const response = await fetch(
          `https://www.thebluealliance.com/api/v3/team/frc${teamNumber}/media/2023`,
          { headers: headers }
        );
        let data = await response.json();
        if (data.length > 0) {
          setImage(data[1].direct_url);
        }
      } catch (e) {
        console.log(e);
      }
    }

    if (teamNumber != "[...team]") {
      getData();
      getImage();
    }
  }, [teamNumber]);

  return (
    <div style={{ padding: "10px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1>Team {teamNumber}</h1>
        {img ? (
          <img src={img} alt="robot image" style={{ maxHeight: "150px" }} />
        ) : (
          "Loading"
        )}
      </div>
      {/* <div style={{ display: "flex" }}>
        {[0, 1, 2].map((item) => {
          return (
            <StatsRing
              data={[
                {
                  label: "Max Scoring Potential",
                  stats: "25 Cones",
                  progress: 65,
                  color: "white",
                  icon: "up",
                },
                {
                  label: "Max Scoring Potential",
                  stats: "25 Cones",
                  progress: 65,
                  color: "white",
                  icon: "up",
                },
              ]}
            />
          );
        })}
      </div> */}
      {agg ? <SingleTeamData team={parseInt(teamNumber)} /> : <>Loading</>}
      {matches ? (
        <Chart team={parseInt(teamNumber)} matches={matches} />
      ) : (
        <></>
      )}
    </div>
  );
}
