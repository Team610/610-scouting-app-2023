import { Button, Select } from "@mantine/core";
import React, { use, useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import NextCors from "nextjs-cors";
import { match } from "assert";
import { useRouter } from "next/router";
import Link from "next/link";

export function SelectMatch({
  setSelectedMatch,
  setBlueTeams,
  setRedTeams,
}: {
  setSelectedMatch: Function;
  setBlueTeams: Function;
  setRedTeams: Function;
}) {
  const [matchNumbers, setMatchNumbers] = useState([]);
  const [jsonData, setJsonData] = useState([]);

  const options = matchNumbers.map((number) => ({
    value: number,
    label: `Match #${number}`,
  }));

  useEffect(() => {
    async function fetchData() {
      const headers = {
        "X-TBA-Auth-Key":
          "monpiIlPoQ81Y5bc8zhoMNuTbm8bLHQzYikSQuYYZHvM3BbAm8Y4uFeaOU6bMNg1",
      };
      const response = await fetch(
        "https://www.thebluealliance.com/api/v3/event/2023oncmp2/matches",
        { headers: headers }
      );
      const data = await response.json();
      setJsonData(data);
      setMatchNumbers(
        data.map(
          (item: { match_number: number; comp_level: any; set_number: any }) =>
            (item.comp_level == "sf"
              ? item.comp_level + item.set_number
              : item.comp_level) + item.match_number
        )
      );
    }
    fetchData();
  }, []);

  const selectMatch = (match: any) => {
    setSelectedMatch(match);
    jsonData.forEach((item: any) => {
      if (item.comp_level + item.match_number == match) {
        const red = item.alliances.red.team_keys.map((team: string) =>
          team.substring(3)
        );
        const blue = item.alliances.blue.team_keys.map((team: string) =>
          team.substring(3)
        );
        setBlueTeams(blue);
        setRedTeams(red);
        return;
      }
    });
  };

  return (
    <Select
      label="Choose the match in progress"
      placeholder="Select"
      data={options.sort()}
      searchable
      onChange={(e: any) => selectMatch(e)}
    />
  );
}

export default function SelectMatchDropBox() {
  const [selectedMatch, setSelectedMatch] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [redTeams, setRedTeams] = useState([]);
  const [blueTeams, setBlueTeams] = useState([]);

  const teamOptions = redTeams.concat(blueTeams).map((team, index) => ({
    value: (index < 3 ? "R" : "B") + team,
    label:
      (index < 3 ? "Red " : "Blue ") +
      (index < 3 ? index + 1 : index + 1 - 3) +
      ": " +
      team,
  }));

  return (
    <div>
      <SelectMatch
        setSelectedMatch={setSelectedMatch}
        setBlueTeams={setBlueTeams}
        setRedTeams={setRedTeams}
      />
      {selectedMatch != "" ? (
        <Select
          label="Choose the team you are scouting"
          placeholder="Select"
          data={teamOptions}
          searchable
          onChange={(e: any) => setSelectedTeam(e)}
        />
      ) : null}
      {selectedTeam != "" ? (
        <div className={styles.center}>
          <h2>
            <Link
              href={
                "/match?match=" +
                selectedMatch +
                "&team=" +
                selectedTeam.substring(1) +
                "&red=" +
                redTeams +
                "&blue=" +
                blueTeams
              }
              className={styles.center}
            >
              Start
            </Link>
          </h2>
        </div>
      ) : null}
    </div>
  );
}
