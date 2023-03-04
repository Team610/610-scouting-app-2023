import { Button, Select } from "@mantine/core";
import React, { use, useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import NextCors from "nextjs-cors";
import { match } from "assert";
import { useRouter } from "next/router";
import Link from "next/link";
export default function SelectMatchDropBox() {
  const [jsonData, setJsonData] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState("");
  const [matchNumbers, setMatchNumbers] = useState([]);
  const [teamNumbers, setTeamNumbers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [redTeams, setRedTeams] = useState([]);
  const [blueTeams, setBlueTeams] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const headers = {
        "X-TBA-Auth-Key":
          "monpiIlPoQ81Y5bc8zhoMNuTbm8bLHQzYikSQuYYZHvM3BbAm8Y4uFeaOU6bMNg1",
      };
      const response = await fetch(
        "https://www.thebluealliance.com/api/v3/event/2023isde1/matches",
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

  const options = matchNumbers.map((number) => ({
    value: number,
    label: `Match #${number}`,
  }));

  const selectMatch = (match: any) => {
    setSelectedMatch(match);
    jsonData.forEach((item: any) => {
      if (item.comp_level + item.match_number == match) {
        const red = item.alliances.red.team_keys.map((team) =>
          team.substring(3)
        );
        const blue = item.alliances.blue.team_keys.map((team) =>
          team.substring(3)
        );
        setBlueTeams(blue);
        setRedTeams(red);
        setTeamNumbers(red.concat(blue));
        return;
      }
    });
  };

  const teamOptions = teamNumbers.map((team, index) => ({
    value: (index < 3 ? "R" : "B") + team,
    label:
      (index < 3 ? "Red " : "Blue ") +
      (index < 3 ? index + 1 : index + 1 - 3) +
      ": " +
      team,
  }));

  const selectTeam = (team: any) => {
    const color = team.substring(0, 1);
    const number = team.substring(1);
  };

  return (
    <div>
      <Select
        label="Choose an event in progress"
        placeholder="Select"
        data={options}
        searchable
        onChange={(e: any) => selectMatch(e)}
      />
      {selectedMatch != "" ? (
        <Select
          label="Choose an event in progress"
          placeholder="Select"
          data={teamOptions}
          searchable
          onChange={(e: any) => selectTeam(e)}
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
                selectedTeam.substring(3)
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
