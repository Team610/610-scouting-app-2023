import { useEffect, useState } from "react";
import Field from "./field";
import TimerFunction from "./TimerFunction";
import { Button } from "@mantine/core";
import ChargeStation from "./ChargeStation";

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

export default function MatchScreen() {
  const [gamePieces, setGamePieces] = useState<GamePiece[]>([]);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState("auto");
  const [chargingStation, setChargingStation] = useState(
    deafultChargingStation
  );

  TimerFunction(15, setGameState, setChargingStation);

  const scores = {
    lvl1: 2,
    lvl2: 3,
    lvl3: 5,
  };

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
    let addScore =
      scores[level === 1 ? "lvl1" : level === 2 ? "lvl2" : "lvl3"] +
      (gameState ? 1 : 0);
    if (!remove) {
      setGamePieces([...gamePieces, obj]);
      setScore(score + addScore);
    } else {
      setScore(score - addScore);
    }
  }

  return (
    <>
      <p> Score: {score} </p>
      <Field addGamePiece={addGamePiece} />
      <ChargeStation
        auto={gameState}
        setChargingStation={setChargingStation}
        chargingStation={chargingStation}
      />
    </>
  );
}
