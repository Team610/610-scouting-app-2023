import { BubbleChart } from "../components/bubbleChart";
import { RadarChart } from "../components/radarChart";

export function Chart() {
  return <RadarChart />;
}

export default function Compare() {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: "1" }}>
        <Chart />
      </div>
      <div style={{ flex: "1" }}>
        <Chart />
      </div>
    </div>
  );
}
