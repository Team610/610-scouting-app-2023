import { useEffect, useState } from "react";
import { Checkbox, getSortedBreakpoints, Switch } from "@mantine/core";
import { Text } from "@mantine/core";
import { NativeSelect } from "@mantine/core";
import { ChargingStation, deafultChargingStation } from "./match";

//returns checkboxes so the user can see if the robot is docked or engaged
function ChargeScoring({
  gameState,
  chargeStationScore,
}: {
  gameState: String;
  chargeStationScore: Function;
}) {
  //see if the robot is docked
  const [docked, setDocked] = useState(false);
  //see if the robot is engaged
  const [engaged, setEngaged] = useState(false);
  //sees if first time switching to teleop
  const [firstTime, setFirstTime] = useState(true);
  useEffect(() => {
    if (gameState != "auto" && firstTime) {
      setFirstTime(false);
      setDocked(false);
      setEngaged(false);
    }
    chargeStationScore(docked, engaged);
  }, [gameState, docked, engaged]);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <Checkbox
          checked={docked}
          onChange={(event) => setDocked(event.currentTarget.checked)}
          sx={{
            "& .mantine-Checkbox-label": {
              color: "white",
              fontFamily: "arial",
              fontSize: "20px",
            },
          }}
          size="xl"
          label="Docked"
          value="docked"
        />

        <Checkbox
          checked={engaged}
          onChange={(event) => setEngaged(event.currentTarget.checked)}
          sx={{
            "& .mantine-Checkbox-label": {
              color: "white",
              fontFamily: "arial",
              fontSize: "20px",
            },
          }}
          size="xl"
          label="Engaged"
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
          # of Alliance Members are Docked/Engaged?
        </Text>
        <NativeSelect
          onChange={(event) =>
            setNumPartners(parseInt(event.currentTarget.value))
          }
          data={["0", "1", "2"]}
        />
      </div>
    </>
  );
}

export default function ChargeStation({
  gameState,
  setNumPartners,
  chargeStationScore,
}: {
  gameState: String;
  setNumPartners: Function;
  chargeStationScore: Function;
}) {
  //old points of auto so it carries over to teleop
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ margin: "20px+50px+15px" }}>
          <ChargeScoring
            gameState={gameState}
            chargeStationScore={chargeStationScore}
          />
        </div>
        {gameState == "auto" ? null : (
          <NumPartners setNumPartners={setNumPartners} />
        )}
      </div>
    </>
  );
}
