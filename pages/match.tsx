import { useEffect, useState } from "react";
import Field from "./field";
import TimerFunction from "./TimerFunction";
import { Button } from "@mantine/core";
import ChargeStation from "./ChargeStation";
import { IconDentalBroken } from "@tabler/icons";
import { Text } from "@mantine/core";
import Intake from "./intake";

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
    points: number;
  };
  teleop: {
    dock: boolean;
    engage: boolean;
    numPartners: number;
    points: number;
  };
}

export let deafultChargingStation = {
  auto: {
    dock: false,
    engage: false,
    points: 0,
  },
  teleop: {
    dock: false,
    engage: false,
    numPartners: 0,
    points: 0,
  },
};

export default function MatchScreen() {
  const [gamePieces, setGamePieces] = useState<GamePiece[]>([]);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState("auto");
  const [chargingStation, setChargingStation] = useState(
    deafultChargingStation
  );
  const [gamePiece, setGamePiece] = useState("nothing");

  TimerFunction(15, setGameState, setChargingStation);

  const scores = {
    lvl1: 2,
    lvl2: 3,
    lvl3: 5,
  };

  const chargeScores = {
    autoDock: 8,
    autoEngage: 12,
    teleopDock: 6,
    teleopEngage: 10
  }

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
    setGamePiece("nothing");
    
  }

  const [chargePoints, setChargePoints] = useState(0);
  function chargeStationScore(
    docked: boolean,
    engaged: boolean
  ) {
    
    if(gameState == "auto") {
      setChargingStation({
        auto: {
          dock: docked,
          engage: docked && engaged,
          points: chargingStation.auto.dock ? chargingStation.auto.dock && chargingStation.auto.engage ? 12 : 8 : 0,
        },
        teleop: {
          dock: chargingStation.teleop.dock,
          engage: chargingStation.teleop.engage,
          numPartners: chargingStation.teleop.numPartners,
          points: chargingStation.teleop.points,
        },
      })
    } else {
      setChargingStation({
        auto: {
          dock: chargingStation.auto.dock,
          engage: chargingStation.auto.engage,
         points: chargingStation.auto.points
        },
        teleop: {
          dock: docked,
          engage: docked && engaged,
          numPartners: chargingStation.teleop.numPartners,
          points: chargingStation.teleop.dock ? chargingStation.teleop.dock && chargingStation.teleop.engage ? 10 : 6 : 0,
        },
      })
    }  
    
  }

  function setNumPartners(partners: number) {
    setChargingStation({
      auto: {
        dock: chargingStation.auto.dock,
        engage: chargingStation.auto.engage,
        points: chargingStation.auto.points
      },
      teleop: {
        dock: chargingStation.teleop.dock,
        engage: chargingStation.teleop.engage,
        numPartners: partners,
        points: chargingStation.teleop.points
      },
    })
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ margin: "0px 0px 500px 10px" }}>
          <Intake gamePiece={gamePiece} setGamePiece={setGamePiece} />
        </div>
        <div style={{display: "flex", flexDirection: "column", alignItems: "flex-end", margin: "50px 0px 0px 50px", gap:"50px"}}>
          <Text style={{ margin: "0px 0px 0px 625px", fontFamily: "initial", fontSize: "56px" }}>You have {gamePiece}</Text>
          {gamePiece != "nothing" ? <Button size="xl" onClick={() => setGamePiece("nothing") }>Robot dropped the {gamePiece}</Button> : null}
        </div>
        
      </div>
      <p> Score: {score + chargingStation.auto.points + chargingStation.teleop.points} </p>
      <Field addGamePiece={addGamePiece} pickedupGamePiece={gamePiece} />
      <ChargeStation
        gameState={gameState}
        setNumPartners={setNumPartners}
        chargeStationScore={chargeStationScore}
      />
      <p>{chargingStation.teleop.numPartners}</p>

    </>
  );
}
