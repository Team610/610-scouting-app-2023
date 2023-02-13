import { useEffect, useState } from "react";
import { Checkbox, getSortedBreakpoints, Switch } from "@mantine/core";
import { Text } from "@mantine/core";
import { NativeSelect } from "@mantine/core";
import { ChargingStation, deafultChargingStation } from "./match";

//returns checkboxes so the user can see if the robot is docked or engaged
function ChargeScoring({
  isAuto,
  setChargingStation,
  chargingStation,
}: {
  isAuto: String;
  setChargingStation: Function;
  chargingStation: ChargingStation;
}) {
  //see if the robot is docked
  const [docked, setDocked] = useState(false);
  //see if the robot is engaged
  const [engaged, setEngaged] = useState(false);

  useEffect(() => {
    setChargingStation({
      auto: {
        dock: isAuto && docked,
        engage: isAuto && engaged,
      },
      teleop: {
        dock: !isAuto && docked,
        engage: !isAuto && engaged,
        numPartners: chargingStation.teleop.numPartners,
      },
    });
    if (isAuto === "teleop") {
      setDocked(false);
      setEngaged(false);
    }
  }, [docked, engaged, isAuto]);

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
          label="Engaged"
          value="engaged"
        />
      </div>
    </>
  );
}

//returns a drop down menu so the user can choose how many users are docked or engaged (only useful during AutoOP)
function NumPartners({
  setChargingStation,
  chargingStation,
}: {
  setChargingStation: Function;
  chargingStation: ChargingStation;
}) {
  //variable used to track number of partners due to a drop down
  const [value, setValue] = useState(0);

  function updateState(partners: number) {
    setValue(partners);
    setChargingStation({
      auto: {
        dock: chargingStation.auto.dock,
        engage: chargingStation.auto.engage,
      },
      teleop: {
        dock: chargingStation.teleop.dock,
        engage: chargingStation.teleop.engage,
        numPartners: value,
      },
    });
  }
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
          value={value}
          onChange={(event) => updateState(parseInt(event.currentTarget.value))}
          data={["1", "2", "3"]}
        />
      </div>
    </>
  );
}

export default function ChargeStation({
  auto,
  setChargingStation,
  chargingStation,
}: {
  auto: String;
  setChargingStation: Function;
  chargingStation: ChargingStation;
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
            isAuto={auto}
            setChargingStation={setChargingStation}
            chargingStation={chargingStation}
          />
        </div>
        {auto == "auto" ? null : (
          <NumPartners
            setChargingStation={setChargingStation}
            chargingStation={chargingStation}
          />
        )}
      </div>
    </>
  );
}
