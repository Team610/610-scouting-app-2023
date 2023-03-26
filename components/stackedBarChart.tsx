import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import { getMatch, getMatchList } from "../neo4j/Aggregate";
import { matchStats, statLegend } from "./statsSelector";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  plugins: {
    title: {
      display: true,
      text: "Chart.js Bar Chart - Stacked",
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

const colors = [
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)",
  "rgba(230,14,230, 1)",
  "rgba(24,203,90, 1)",
  "rgba(34,81,222, 1)",
  "rgba(237,132,77, 1)",
  "rgba(0,118,19, 1)",
  "rgba(159,85,85, 1)",
];

async function getData(team: number, matches: string[], stats: string[]) {
  const matchData: any = {};
  let data = { labels: [""], datasets: [{}] };

  for (let index = 0; index < matches.length; index++) {
    const match = await getMatch(team, matches[index]);
    matchData[matches[index]] = match;
  }
  data = {
    labels: stats,
    datasets: matches.map((match, idx) => {
      return {
        label: match,
        data: stats.map((stat) => {
          return matchData[match][stat];
        }),
        backgroundColor: colors[idx],
      };
    }),
  };
  return data;
}

export default function StackedBarChart({
  team,
  matches,
  stats,
}: {
  team: number;
  matches: string[];
  stats: string[];
}) {
  const [data, setData] = useState<any>();
  useEffect(() => {
    async function test() {
      let res = await getData(team, matches.sort(), stats);
      setData(res);
    }
    test();
  }, [matches, stats]);
  if (data) {
    return <Bar options={options} data={data} />;
  }
  return <>Loading...</>;
}
