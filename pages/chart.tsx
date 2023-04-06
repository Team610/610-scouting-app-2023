import { useEffect, useState } from "react";
import { BubbleChart } from "../components/bubbleChart";
import { RadarChart } from "../components/radarChart";
import { blue } from "@nextui-org/react";
import { SelectMatch } from "./matches";
import CompareTeams, { CompareTeamData } from "./compareTeams";

export default function Compare() {
  const [redTeams, setRedTeams] = useState([610, 2013, 0]);
  const [blueTeams, setBlueTeams] = useState([0, 0, 0]);
  const [selectedMatch, setSelectedMatch] = useState();
  const [displayTable, setTable] = useState(false);
  useEffect(() => {
    async function getMatches() {
      let allMatches: any[] = await (
        await fetch(
          "https://www.thebluealliance.com/api/v3/team/frc610/event/2023onnob/matches/simple",
          {
            headers: {
              "X-TBA-Auth-Key":
                "monpiIlPoQ81Y5bc8zhoMNuTbm8bLHQzYikSQuYYZHvM3BbAm8Y4uFeaOU6bMNg1",
            },
          }
        )
      ).json();
      for (let index = 0; index < allMatches.length; index++) {
        const element = allMatches[index];
        if (element.actual_time == null) {
          let blueTeams = element.alliances.blue.team_keys.map((team: string) =>
            parseInt(team.substring(3))
          );
          let redTeams = element.alliances.red.team_keys.map((team: string) =>
            parseInt(team.substring(3))
          );
          setRedTeams(redTeams);
          setBlueTeams(blueTeams);
          break;
        }
      }
    }
    getMatches();
  }, []);

  return (
    <div>
      {/* <SelectMatch
        setRedTeams={setRedTeams}
        setBlueTeams={setBlueTeams}
        setSelectedMatch={setSelectedMatch}
      /> */}
      <div style={{ display: "flex" }}>
        {" "}
        <div style={{ flex: "1" }}>
          <RadarChart teams={redTeams} />
        </div>
        <div style={{ flex: "1" }}>
          <RadarChart teams={blueTeams} />
        </div>{" "}
      </div>
      <CompareTeams />
      {/* <Button onClick={() => setTable(!displayTable)}>{}</Button>
      {displayTable ? (
        <CompareTeamData teams={redTeams.concat(blueTeams)} />
      ) : (
        <></>
      )} */}
    </div>
  );
}
