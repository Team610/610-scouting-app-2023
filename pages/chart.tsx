import { useEffect, useState } from "react";
import { RadarChart } from "../components/radarChart";
import { blue } from "@nextui-org/react";
import { SelectMatch } from "./matches";
import CompareTeams, { CompareTeamData } from "../components/compareTeams";
import { Button } from "@mantine/core";
import Matchup from "../components/matchup";
import { TeamInput } from "../components/teamInput";

export default function Compare() {
  const [redTeams, setRedTeams] = useState([610, 1310, 1285]);
  const [blueTeams, setBlueTeams] = useState([4069, 4907, 1334]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState();
  const [selectingMatch, setSelectingMatch] = useState(false);
  const [editTeams, setEditTeams] = useState(false);
  useEffect(() => {
    async function getMatches() {
      let allMatches: any[] = await (
        await fetch(
          "https://www.thebluealliance.com/api/v3/team/frc610/event/2023hop/matches/simple",
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

  function handleBlueTeams(num: number, idx: number) {
    let newBlue = [...blueTeams];
    newBlue[idx] = num;
    setBlueTeams(newBlue);
  }

  function handleRedTeams(num: number, idx: number) {
    let newRed = [...redTeams];
    newRed[idx] = num;
    setRedTeams(newRed);
  }

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

      {editTeams ? (
        <div style={{ display: "flex", width: "100%" }}>
          <div style={{ flex: 1 }}>
            {[0, 1, 2].map((idx) => (
              <div key={idx}>
                <TeamInput
                  setTeam={handleBlueTeams}
                  num={blueTeams[idx]}
                  idx={idx}
                />
              </div>
            ))}
          </div>
          <div style={{ flex: 1 }}>
            {[0, 1, 2].map((idx) => (
              <div key={idx}>
                <TeamInput
                  setTeam={handleRedTeams}
                  num={redTeams[idx]}
                  idx={idx}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}

      <div style={{ display: "flex", gap: "10px", padding: "10px 0px" }}>
        <Button onClick={() => setSelectingMatch(!selectingMatch)}>
          {selectingMatch ? "Submit Match" : "Select Match"}
        </Button>
        <Button onClick={() => setEditTeams(!editTeams)}>
          {editTeams ? "Save" : "Edit Teams"}
        </Button>
      </div>

      {loading || selectingMatch || editTeams ? (
        <></>
      ) : (
        <>
          <h1>Radar</h1>
          <div style={{ display: "flex" }}>
            {" "}
            <div style={{ flex: "1" }}>
              <RadarChart teams={redTeams} />
            </div>
            <div style={{ flex: "1" }}>
              <RadarChart teams={blueTeams} />
            </div>{" "}
          </div>
          <h1>Comapre</h1>
          <CompareTeams teams={redTeams.concat(blueTeams)} />
          <h1>Matchup</h1>
          <Matchup defaultTeams={redTeams.concat(blueTeams)} />
        </>
      )}
    </div>
  );
}
