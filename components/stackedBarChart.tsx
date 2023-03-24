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

async function getData(team: number) {
  const labels = await getMatchList(team);
  const temp = [];
  let data = { labels: [""], datasets: [{}] };

  if (labels) {
    for (let index = 0; index < labels.length; index++) {
      const match = await getMatch(team, labels[index]);
      console.log(match);
    }
    data = {
      labels,
      datasets: [
        {
          label: "Stat 1",
          data: labels.map(() =>
            faker.datatype.number({ min: -1000, max: 1000 })
          ),
          backgroundColor: "rgb(255, 99, 132)",
        },
        {
          label: "Stat 2",
          data: labels.map(() =>
            faker.datatype.number({ min: -1000, max: 1000 })
          ),
          backgroundColor: "rgb(75, 192, 192)",
        },
        {
          label: "Stat 3",
          data: labels.map(() =>
            faker.datatype.number({ min: -1000, max: 1000 })
          ),
          backgroundColor: "rgb(53, 162, 235)",
        },
      ],
    };
  }
  return data;
}
export default function StackedBarChart({ team }: { team: number }) {
  const [data, setData] = useState<any>();
  useEffect(() => {
    async function test() {
      let res = await getData(team);
      setData(res);
    }
    test();
  }, []);
  if (data) {
    return <Bar options={options} data={data} />;
  }
  return <>Loading...</>;
}
