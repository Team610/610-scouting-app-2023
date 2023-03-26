import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bubble } from "react-chartjs-2";
import { faker } from "@faker-js/faker";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

export const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  tooltips: {
    callbacks: {
      label: function (tooltipItem: any, data: any) {
        var label = data.labels[tooltipItem.index];
        return (
          label + ": (" + tooltipItem.xLabel + ", " + tooltipItem.yLabel + ")"
        );
      },
    },
  },
};

export const data = {
  labels: ["Label 1", "Label 2", "Label 3"],
  datasets: [
    {
      label: "Red dataset",
      data: Array.from({ length: 2 }, () => ({
        x: faker.datatype.number({ min: -100, max: 100 }),
        y: faker.datatype.number({ min: -100, max: 100 }),
      })),
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Blue dataset",
      data: Array.from({ length: 1 }, () => ({
        x: faker.datatype.number({ min: -100, max: 100 }),
        y: faker.datatype.number({ min: -100, max: 100 }),
      })),
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

export function BubbleChart() {
  return <Bubble options={options} data={data} />;
}
