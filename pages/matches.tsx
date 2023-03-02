import { Select } from "@mantine/core";
import React, { useState, useEffect } from "react";
export default function SelectMatchDropBox() {
  const [jsonData, setJsonData] = useState("");
  const [matchNumbers, setMatchNumbers] = useState([]);
  const [match, setMatch] = useState<string>()
  const [team, setTeam] = useState<string>()

  useEffect(() => {
    async function fetchData() {
      let eventName = "2023week0";
      const headers = {
        "X-TBA-Auth-Key": process.env.NEXT_PUBLIC_TBA_KEY!,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Requested-With",
      };
      const response = await fetch(
        `https://www.thebluealliance.com/api/v3/event/${eventName}/matches`,
        { headers: headers }
      );
      const data = await response.json();
      console.log(data)
      setJsonData(data);
      setMatchNumbers(
        data.map((item: { match_number: any }) => item.match_number)
      );
    }
    fetchData();
  }, []);

  const handleMatchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.currentTarget.value)
    setMatch(event.target.value);
  };
  const handleTeamChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeam(event.target.value);
  };

  const options = matchNumbers.map((number) => ({
    value: number,
    label: `Match #${number}`,
  }));

  return (
    <div>
      <Select
        label="Choose an event in progress"
        placeholder="Select"
        data={options}
        searchable
        value={match}
        onChange={(e: any) => handleMatchChange(e)}
      />
      {match && <Select
        label="Choose an event in progress"
        placeholder="Select"
        data={options}
        searchable
        value={team}
        onChange={(e: any) => handleTeamChange(e)}
      />}
    </div>
  );
}
