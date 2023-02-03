import { useState } from "react";
import Field from "./field";
import TimerFunction from "./TimerFunction";

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

export default function MatchScreen() {
  const [gamePieces, setGamePieces] = useState<GamePiece[]>([]);
  const [score, setScore] = useState(0);
  const [auto, setAuto] = useState(true);

  let time = TimerFunction(15, setAuto);

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
      auto: auto,
      level: level,
      cone: cone,
      grid: grid,
    };
    let addScore =
      scores[level === 1 ? "lvl1" : level === 2 ? "lvl2" : "lvl3"] +
      (auto ? 1 : 0);
    console.log(remove);
    if (!remove) {
      setGamePieces([...gamePieces, obj]);
      setScore(score + addScore);
    } else {
      setScore(score - addScore);
    }
  }

  return (
    <>
      <p>Score: {score}</p>
      <Field addGamePiece={addGamePiece} />
      {auto ? "auto" : "teleop"}
    </>
  );
}
