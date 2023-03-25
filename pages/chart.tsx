import { BubbleChart } from "../components/bubbleChart";
import { PieChart } from "../components/pieChart";
import { RadarChart } from "../components/radarChart";
import StackedBarChart from "../components/stackedBarChart";
import StatSelector from "../components/statsSelector";

export default function Chart() {
  return (
    <>
      <StatSelector />
      <StackedBarChart team={2056} />;
    </>
  );
}
