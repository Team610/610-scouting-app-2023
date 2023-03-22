import { Button } from "@mantine/core";
import { useState } from "react";

export function ScoreButton({
  level,
  gamePiece,
  score,
}: {
  level: number;
  gamePiece: string;
  score: Function;
}) {
  const [count, setCount] = useState(0);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <p style={{ width: "max-content" }}>Lvl {level}</p>
      <Button
        color="red"
        onClick={() => {
          if (count > 0 && gamePiece == "nothing") {
            setCount(Math.max(0, count - 1));
            //only last parameter matters, (level, cone, remove)
            score(level, undefined, true);
          }
        }}
      >
        -
      </Button>
      <h3>{count}</h3>
      <Button
        color="green"
        onClick={() => {
          if (gamePiece !== "nothing") {
            setCount(count + 1);
            score(level, gamePiece == "cone");
          }
        }}
      >
        +
      </Button>
    </div>
  );
}

export default function Display({
  pickedupGamePiece,
  scoreGamePiece,
}: {
  pickedupGamePiece: string;
  scoreGamePiece: Function;
}) {
  return (
    <div>
      <ScoreButton
        level={1}
        gamePiece={pickedupGamePiece}
        score={scoreGamePiece}
      />
      <ScoreButton
        level={2}
        gamePiece={pickedupGamePiece}
        score={scoreGamePiece}
      />
      <ScoreButton
        level={3}
        gamePiece={pickedupGamePiece}
        score={scoreGamePiece}
      />
    </div>
  );
}
