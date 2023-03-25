import { MultiSelect } from "@mantine/core";
import { useState } from "react";

const matchStats = [
  { value: "autoCycles", label: "Auto Cycles" },
  { value: "autoTop", label: "Auto Top" },
  { value: "autoMiddle", label: "Auto Middle" },
  { value: "autoBottom", label: "Auto Bottom" },
  { value: "teleopCycles", label: "Teleop Cycles" },
  { value: "teleopTop", label: "Teleop Scored" },
  { value: "teleopMiddle", label: "Teleop Scored" },
  { value: "teleopBottom", label: "Teleop Scored" },
  { value: "autoClimbPoints", label: "Auto Climb Points" },
  { value: "teleopClimbPoints", label: "Teleop Climb Points" },
  { value: "mobility", label: "Mobility" },
];

export default function StatSelector() {
  //used for matches and stats
  const [stats, setStats] = useState();
  return <MultiSelect data={matchStats} label="Stats" />;
}
