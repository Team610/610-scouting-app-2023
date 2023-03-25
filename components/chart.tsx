import { useEffect, useState } from "react";
import { BubbleChart } from "./bubbleChart";
import { PieChart } from "./pieChart";
import { RadarChart } from "./radarChart";
import StackedBarChart from "./stackedBarChart";
import { matchStats } from "./statsSelector";
import { MultiSelect } from "@mantine/core";
import { getMatchList } from "../neo4j/Aggregate";

export default function Chart({
  team,
  matches,
}: {
  team: number;
  matches: string[];
}) {
  const [stats, setStats] = useState<string[]>(
    matchStats.map((stats) => stats.value)
  );
  const [selectedMatches, setSelectedMatches] = useState<string[]>(matches);

  return (
    <>
      <MultiSelect
        label="Stats"
        onChange={(e) => setStats(e)}
        data={matchStats}
        defaultValue={stats}
      />
      {matches !== null ? (
        <MultiSelect
          label="Matches"
          onChange={(e) => setSelectedMatches(e)}
          defaultValue={selectedMatches}
          data={matches.sort()}
        />
      ) : (
        <>Loading...</>
      )}
      <StackedBarChart team={team} matches={selectedMatches} stats={stats} />
    </>
  );
}
