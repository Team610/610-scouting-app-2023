import { useEffect, useState } from "react";
import { RadarChart } from "../components/radarChart";
import { blue } from "@nextui-org/react";
import { SelectMatch } from "./matches";
import CompareTeams, { CompareTeamData } from "./compareTeams";
import { Button } from "@mantine/core";

export default function Compare() {
  const [redTeams, setRedTeams] = useState([610, 2013, 0]);
  const [blueTeams, setBlueTeams] = useState([0, 0, 0]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState();
  const [selectingMatch, setSelectingMatch] = useState(false);
  useEffect(() => {
    async function getMatches() {
      let allMatches: any[] = await (
        await fetch(
          "https://www.thebluealliance.com/api/v3/team/frc610/event/2023oncmp2/matches/simple",
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
      setLoading(false);
    }
    getMatches();
  }, []);

  return (
    <div>
      {selectingMatch ? (
        <SelectMatch
          setRedTeams={setRedTeams}
          setBlueTeams={setBlueTeams}
          setSelectedMatch={setSelectedMatch}
        />
      ) : (
        <></>
      )}
      <Button onClick={() => setSelectingMatch(!selectingMatch)}>
        {selectingMatch ? "Submit Match" : "Select Match"}
      </Button>
      {loading || selectingMatch ? (
        <></>
      ) : (
        <>
          <div style={{ display: "flex" }}>
            {" "}
            <div style={{ flex: "1" }}>
              <RadarChart teams={redTeams} />
            </div>
            <div style={{ flex: "1" }}>
              <RadarChart teams={blueTeams} />
            </div>{" "}
          </div>
          <CompareTeams defaultTeams={redTeams.concat(blueTeams)} />
        </>
      )}
    </div>
  );
}
