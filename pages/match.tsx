import { useEffect, useState } from "react";
import { Button, Checkbox } from "@mantine/core";
import ChargeStation from "./ChargeStation";
import Intake from "./intake";
import ScoringGrid from "./scoringGrid";
import { clientCycle, submitMatch } from "../neo4j/SubmitMatch";
import { getNeoSession } from "../neo4j/Session";
import { convertCycleServer } from "../lib/clientCycleToServer";
import { useRouter } from "next/router";
import React from "react";

export interface Score {
  auto: number;
  teleop: number;
}

export interface ChargingStation {
  auto: {
    dock: boolean;
    engage: boolean;
  };
  teleop: {
    dock: boolean;
    engage: boolean;
    numPartners: number;
  };
}

export let deafultChargingStation = {
  auto: {
    dock: false,
    engage: false,
  },
  teleop: {
    dock: false,
    engage: false,
    numPartners: 0,
  },
};

export default function MatchScreen() {
  const [gamePieces, setGamePieces] = useState<clientCycle[]>([]);
  const [gameState, setGameState] = useState<string>("auto");
  const [chargingStation, setChargingStation] = useState(
    deafultChargingStation
  );
  const [gamePiece, setGamePiece] = useState("nothing");
  const [mobility, setMobility] = useState(false);
  const [parked, setParked] = useState(false);
  const router = useRouter();
  const [blueAllaince, setBlueAllaince] = useState(false);

  const [time, setTime] = useState(18);

  const queryParams = router.query;
  const matchID = queryParams.match?.toString()!;
  const teamID = parseInt(queryParams.team?.toString()!);
  const red = queryParams.red?.toString().split(",");
  const blue = queryParams.blue?.toString().split(",");

  // redirect page to "TeleOp" after 10 seconds while displaying remaining time on page
  useEffect(() => {
    const timer = setTimeout(() => {
      setTime(time - 1);
    }, 1000);
    if (time === 0) {
      setGameState("teleop");
      setChargingStation(deafultChargingStation);
    }

    if (blue?.includes(teamID.toString())) {
      setBlueAllaince(true);
      blue.splice(blue.indexOf(teamID.toString()), 1);
    } else {
      red?.splice(red.indexOf(teamID.toString()), 1);
    }

    return () => clearTimeout(timer);
  }, [time]);

  function addGamePiece(x: number, y: number, cone: boolean) {
    let obj: clientCycle = {
      x: x,
      y: y,
      cone: cone,
      auto: gameState == "auto",
      grid: 0,
      level: 0,
      position: 0,
      link: false,
    };
    let temp = [...gamePieces, obj];
    setGamePieces(temp);
  }

  function scoreGamePiece(
    level: number,
    cone: boolean,
    grid: number,
    position: number,
    remove: boolean | undefined
  ) {
    let temp = gamePieces;
    let obj = temp[gamePieces.length - 1];
    obj.auto = gameState == "auto";
    obj.cone = cone;
    obj.grid = grid;
    obj.level = level;
    obj.position = position;

    console.log(obj);
    console.log(remove);

    // if we the game piece has been scored, add it to the cycles
    if (!remove) {
      temp[temp.length - 1] = obj;

      setGamePieces(temp);
      setGamePiece("nothing");
    }
    // only want to set game piece to nothing if it has been scored
    else {
      setGamePiece(gamePieces[gamePieces.length - 1].cone ? "cone" : "cube");
    }
  }

  function updateChargeStation(docked: boolean, engaged: boolean) {
    let obj = { ...chargingStation };
    if (gameState == "auto") {
      obj.auto.dock = docked;
      obj.auto.engage = engaged;
    } else {
      obj.teleop.dock = docked;
      obj.teleop.engage = engaged;
    }
    setChargingStation(obj);
  }

  function setNumPartners(partners: number) {
    let obj = { ...chargingStation };
    obj.teleop.numPartners = partners;
    setChargingStation(obj);
  }

  function linkGamePiece() {
    gamePieces[gamePieces.length - 1].link = true;
  }

  function LinkScored() {
    const [isVisible, setIsVisible] = useState(true);

    return (
      <div>
        {isVisible &&
          gamePiece == "nothing" &&
          gamePieces.length > 0 &&
          !gamePieces[gamePieces.length - 1].link && (
            <Button
              onClick={() => {
                setIsVisible(!isVisible);
                linkGamePiece();
              }}
            >
              Link Scored
            </Button>
          )}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
        <>
          <div style={{ display: "flex", gap: "10px" }}>
            {!blueAllaince ? (
              <div style={{ display: "flex" }}>
                <ScoringGrid
                  addGamePiece={addGamePiece}
                  pickedupGamePiece={gamePiece}
                  scoreGamePiece={scoreGamePiece}
                  isBlueAlliance={blueAllaince}
                />
              </div>
            ) : null}
            <div>
              <Intake
                gamePiece={gamePiece}
                setGamePiece={setGamePiece}
                addGamePiece={addGamePiece}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <p
                    style={{
                      fontSize: "16px",
                      color: "white",
                    }}
                  >
                    You have {gamePiece}
                  </p>
                  <LinkScored />
                  {gamePiece != "nothing" ? (
                    <Button size="md" onClick={() => setGamePiece("nothing")}>
                      Robot dropped the {gamePiece}
                    </Button>
                  ) : null}
                </div>
                <ChargeStation
                  gameState={gameState}
                  setNumPartners={setNumPartners}
                  chargeStationScore={updateChargeStation}
                />
                {gameState == "auto" ? (
                  <Checkbox
                    checked={mobility}
                    onChange={(e) => setMobility(e.target.checked)}
                    label="Moved off auto line"
                    size="xl"
                  />
                ) : (
                  <Checkbox
                    checked={parked}
                    onChange={(e) => setParked(e.target.checked)}
                    label="Parked"
                    size="xl"
                  />
                )}
              </div>
            </div>
          </div>
          {blueAllaince ? (
            <ScoringGrid
              addGamePiece={addGamePiece}
              pickedupGamePiece={gamePiece}
              scoreGamePiece={scoreGamePiece}
              isBlueAlliance={blueAllaince}
            />
          ) : null}
        </>
      </div>
      {gameState == "teleop" ? (
        <Button
          onClick={async () => {
            await submitMatch({
              team: teamID,
              allies: blueAllaince
                ? blue?.map((item) => parseInt(item))!
                : red?.map((item) => parseInt(item))!,
              enemies: blueAllaince
                ? red?.map((item) => parseInt(item))!
                : blue?.map((item) => parseInt(item))!,
              match: matchID,
              cycles: convertCycleServer(gamePieces),
              autoClimb: chargingStation.auto.engage
                ? 2
                : chargingStation.auto.dock
                ? 1
                : 0,
              teleopClimb: chargingStation.teleop.engage
                ? 2
                : chargingStation.teleop.dock
                ? 1
                : 0,
              numPartners: chargingStation.teleop.numPartners,
              mobility: mobility,
              park: parked,
            });
            router.push("/");
          }}
        >
          Submit Match
        </Button>
      ) : null}
    </div>
  );
}
