import { useEffect, useState } from "react";
import { Checkbox, getSortedBreakpoints, Switch } from "@mantine/core";
import { Text } from "@mantine/core";
import { NativeSelect } from "@mantine/core";
import { ChargingStation, deafultChargingStation } from "../pages/match";

const CheckBoxStyle = {
  "& .mantine-Checkbox-label": {
    color: "white",
    fontFamily: "arial",
    fontSize: "15px",
  },
};

function firstLetterUpperCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

//returns checkboxes so the user can see if the robot is docked or engaged
function ChargeScoring({
  gameState,
  parked,
  chargeStationScore,
}: {
  gameState: string;
  parked: boolean;
  chargeStationScore: Function;
}) {
  //see if the robot is docked
  const [docked, setDocked] = useState(false);
  //see if the robot is engaged
  const [engaged, setEngaged] = useState(false);

  useEffect(() => {
    chargeStationScore(gameState == "auto", docked, engaged);
  }, [gameState, docked, engaged]);

  return (
    <>
      <div style={{ display: "flex", gap: "15px" }}>
        <Checkbox
          checked={docked}
          disabled={engaged || parked}
          onChange={(event) => {
            setDocked(event.currentTarget.checked);
            setEngaged(false);
          }}
          sx={CheckBoxStyle}
          size="md"
          label={firstLetterUpperCase(gameState) + " Docked"}
          value="docked"
        />

        <Checkbox
          disabled={parked || docked}
          checked={engaged}
          onChange={(event) => setEngaged(event.currentTarget.checked)}
          sx={CheckBoxStyle}
          size="md"
          label={firstLetterUpperCase(gameState) + " Engaged"}
          value="engaged"
        />
      </div>
    </>
  );
}

//returns a drop down menu so the user can choose how many users are docked or engaged (only useful during AutoOP)
function NumPartners({ setNumPartners }: { setNumPartners: Function }) {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: "15px", fontFamily: "arial" }}>
          # Robots on Ramp
        </Text>
        <NativeSelect
          onChange={(event) =>
            setNumPartners(parseInt(event.currentTarget.value))
          }
          size="xs"
          data={["1", "2", "3"]}
        />
      </div>
    </>
  );
}

export default function ChargeStation({
  gameState,
  setNumPartners,
  chargeStationScore,
  chargeStation,
}: {
  gameState: string;
  setNumPartners: Function;
  chargeStationScore: Function;
  chargeStation: ChargingStation;
}) {
  const [mobility, setMobility] = useState(false);
  const [parked, setParked] = useState(false);

  function handleMobility(value: boolean) {
    setMobility(value);
    chargeStationScore(gameState == "auto", undefined, undefined, value);
  }

  function handleParked(value: boolean) {
    setParked(value);
    chargeStationScore(gameState == "auto", false, false, value);
  }
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          color: "white",
          gap: "20px",
        }}
      >
        {gameState == "auto" ? (
          <Checkbox
            checked={mobility}
            onChange={(e) => handleMobility(e.currentTarget.checked)}
            label={"Mobility"}
            sx={CheckBoxStyle}
            size="md"
          />
        ) : (
          <Checkbox
            disabled={chargeStation.teleop.dock || chargeStation.teleop.engage}
            checked={parked}
            onChange={(e) => handleParked(e.currentTarget.checked)}
            label="Parked"
            sx={CheckBoxStyle}
            size="md"
          />
        )}
        <ChargeScoring
          gameState={gameState}
          parked={parked}
          chargeStationScore={chargeStationScore}
        />
        {gameState !== "auto" &&
        (chargeStation.teleop.dock || chargeStation.teleop.engage) ? (
          <NumPartners setNumPartners={setNumPartners} />
        ) : null}
      </div>
    </>
  );
}
