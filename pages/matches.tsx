import { NumberInput, Select } from "@mantine/core";
import React, { useState, useEffect } from "react";
export default function SelectMatchDropBox() {
  const [jsonData, setJsonData] = useState<any>();
  const [matchNumbers, setMatchNumbers] = useState<any>([]);
  const [currMatch, setMatch] = useState<string>();
  const [team, setTeam] = useState<string>();

  useEffect(() => {
    let data = fetchBlueAllaince().then((data) => {
      setJsonData(data);
      jsonData.map((match: any) => {
        console.log(match.comp_level);
        if (match.comp_level !== "sf" && match.comp_level !== "f") {
          setMatchNumbers([
            ...matchNumbers,
            {
              value: match.comp_level + match.match_number,
              label: `Match ${match.comp_level}${match.match_number}`,
            },
          ]);
        }
      });
      // console.log(matchNumbers);
    });
  }, []);

  const handleMatchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //console.log(event.currentTarget.value)
    setMatch(event.target.value);
  };
  const handleTeamChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeam(event.target.value);
  };

  return (
    <div>
      {matchNumbers ? (
        <Select
          label="Choose the match number that is being played"
          placeholder="Select"
          data={matchNumbers}
          searchable
          value={currMatch}
          onChange={(e: any) => setMatch(e)}
        />
      ) : null}
      {/* {match && <Select
        label="Choose the team playing the match"
        placeholder="Select"
        data={matchNumbers}
        searchable
        value={team}
        onChange={(e: any) => setTeam(e)}
      />}
      {match && <Select
        label="Choose the level of match being played"
        placeholder="Select"
        data={options}
        searchable
        value={team}
        onChange={(e: any) => setTeam(e)} */}
    </div>
  );
}

function fetchBlueAllaince() {
  let eventName = "2023week0";
  const headers = {
    "X-TBA-Auth-Key": process.env.NEXT_PUBLIC_TBA_KEY!,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Requested-With",
  };
  const response = fetch(
    `https://www.thebluealliance.com/api/v3/event/${eventName}/matches`,
    { headers: headers }
  )
    .then((res) => res.json())
    .then((data) => data);
  return response;
}
