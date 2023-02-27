import { useState } from "react";
import TimerFunction from "./TimerFunction";
import { Button } from "@mantine/core";
import ChargeStation from "./ChargeStation";
import Intake from "./intake";
import ScoringGrid from "./scoringGrid";

export interface GamePiece {
  auto: boolean;
  level: number;
  cone: boolean;
  grid: number;
}

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

export default async function MatchScreen() {
  const [gamePieces, setGamePieces] = useState<GamePiece[]>([]);
  const [gameState, setGameState] = useState<string>("auto");
  const [chargingStation, setChargingStation] = useState(
    deafultChargingStation
  );
  const [gamePiece, setGamePiece] = useState("nothing");

  //after 15 seconds, switch from auto to teleop
  TimerFunction(15, setGameState, setChargingStation);

  function addGamePiece(
    level: number,
    cone: boolean,
    grid: number,
    remove: boolean | undefined
  ) {
    let obj: GamePiece = {
      auto: gameState == "auto",
      level: level,
      cone: cone,
      grid: grid,
    };
    // if we the game piece has been scored, add it to the cycles
    if (!remove) {
      setGamePieces([...gamePieces, obj]);
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
        <>
          <Intake gamePiece={gamePiece} setGamePiece={setGamePiece} />
        </>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: "24px",
              color: "white",
            }}
          >
            You have {gamePiece}
          </p>
          {gamePiece != "nothing" ? (
            <Button size="md" onClick={() => setGamePiece("nothing")}>
              Robot dropped the {gamePiece}
            </Button>
          ) : null}
          <ChargeStation
            gameState={gameState}
            setNumPartners={setNumPartners}
            chargeStationScore={updateChargeStation}
          />
        </div>
      </div>
      <ScoringGrid addGamePiece={addGamePiece} pickedupGamePiece={gamePiece} />
      {gameState == "teleop" ? (
        <Button onClick={async () => {}}>Submit Match</Button>
      ) : null}
    </div>
  );
}
