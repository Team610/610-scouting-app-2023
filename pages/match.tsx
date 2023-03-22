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
import GamePiece from "./components/CurrentGamePiece";

export interface Score {
  auto: number;
  teleop: number;
}

export interface ChargingStation {
  auto: {
    dock: boolean;
    engage: boolean;
    mobility: boolean;
  };
  teleop: {
    dock: boolean;
    engage: boolean;
    numPartners: number;
    parked: boolean;
  };
}

export let deafultChargingStation = {
  auto: {
    dock: false,
    engage: false,
    mobility: false,
  },
  teleop: {
    dock: false,
    engage: false,
    numPartners: 0,
    parked: false,
  },
};

export default function MatchScreen() {
  const [gamePieces, setGamePieces] = useState<clientCycle[]>([]);
  const [gameState, setGameState] = useState<string>("auto");
  const [chargingStation, setChargingStation] = useState(
    deafultChargingStation
  );
  const [gamePiece, setGamePiece] = useState("nothing");
  const [blueAllaince, setBlueAllaince] = useState(false);

  const router = useRouter();
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

  function addGamePiece(
    x: number,
    y: number,
    cone: boolean,
    substation: string
  ) {
    let obj: clientCycle = {
      x: x,
      y: y,
      substation: substation,
      cone: cone,
      auto: gameState == "auto",
      level: 0,
      link: false,
      dropped: false,
    };
    let temp = [...gamePieces, obj];
    setGamePieces(temp);
  }

  function scoreGamePiece(level: number, cone: boolean, remove?: boolean) {
    let temp = gamePieces;
    let obj = temp[gamePieces.length - 1];
    obj.auto = gameState == "auto";
    // if we the game piece has been scored, add it to the cycles
    if (!remove) {
      obj.cone = cone;
      obj.level = level;
      temp[temp.length - 1] = obj;
      setGamePieces(temp);
      setGamePiece("nothing");
    } else {
      //logic to make the last element align with correct level removed from
      for (let i = gamePieces.length - 1; i >= 0; i--) {
        let piece = gamePieces[i];
        if (piece.level === level) {
          let arr = [...gamePieces];
          arr.splice(i, 1);
          arr.push(piece);
          console.log(arr);
          setGamePieces(arr);
          //reset gamepiece, last element in array will automatically be the piece intaken and not scoredd
          setGamePiece(piece.cone ? "cone" : "cube");
          break;
        }
      }
    }
    console.log(gamePieces);
  }

  function updateChargeStation(
    auto: boolean,
    docked?: boolean,
    engaged?: boolean,
    other?: boolean
  ) {
    let obj = { ...chargingStation };
    if (auto) {
      if (docked !== undefined) obj.auto.dock = docked;
      if (engaged !== undefined) obj.auto.engage = engaged;
      if (other !== undefined) obj.auto.mobility = other;
    } else {
      if (docked !== undefined) obj.teleop.dock = docked;
      if (engaged !== undefined) obj.teleop.engage = engaged;
      if (other !== undefined) obj.teleop.parked = other;
    }
    setChargingStation(obj);
  }

  function setNumPartners(partners: number) {
    let obj = { ...chargingStation };
    obj.teleop.numPartners = partners;
    setChargingStation(obj);
  }

  function LinkScored() {
    const [isVisible, setIsVisible] = useState(true);
    return (
      <div>
        {isVisible &&
          gamePiece == "nothing" &&
          gamePieces.length > 0 &&
          !gamePieces[gamePieces.length - 1].link &&
          !gamePieces[gamePieces.length - 1].dropped && (
            <Button
              onClick={() => {
                setIsVisible(!isVisible);
                gamePieces[gamePieces.length - 1].link = true;
              }}
            >
              Link Scored
            </Button>
          )}
      </div>
    );
  }

  function DroppedGamePiece() {
    return (
      <>
        {gamePiece != "nothing" ? (
          <Button
            size="sm"
            onClick={() => {
              setGamePiece("nothing");
              let temp = [...gamePieces];
              temp[gamePieces.length - 1].dropped = true;
              setGamePieces(temp);
            }}
          >
            Dropped the {gamePiece}
          </Button>
        ) : null}
      </>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "row" }}>
        <>
          <div style={{ display: "flex", gap: "20px" }}>
            <div>
              <div>
                <Intake
                  gamePiece={gamePiece}
                  setGamePiece={setGamePiece}
                  addGamePiece={addGamePiece}
                  blueAllaince={blueAllaince}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "20px",
                    gap: "20px",
                  }}
                >
                  <ChargeStation
                    gameState={"auto"}
                    setNumPartners={setNumPartners}
                    chargeStationScore={updateChargeStation}
                    chargeStation={chargingStation}
                  />
                  {gameState == "teleop" ? (
                    <ChargeStation
                      gameState={"teleop"}
                      setNumPartners={setNumPartners}
                      chargeStationScore={updateChargeStation}
                      chargeStation={chargingStation}
                    />
                  ) : null}
                </div>
              </div>
            </div>
            <div style={{ margin: "10px" }}>
              <ScoringGrid
                pickedupGamePiece={gamePiece}
                scoreGamePiece={scoreGamePiece}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <GamePiece gamePiece={gamePiece} />
                <DroppedGamePiece />
                <LinkScored />
              </div>
            </div>
          </div>
        </>
      </div>
      {gameState == "teleop" && matchID != undefined ? (
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
              numPartners:
                chargingStation.teleop.dock || chargingStation.teleop.engage
                  ? chargingStation.teleop.numPartners
                  : 0,
              mobility: chargingStation.auto.mobility,
              park: chargingStation.teleop.parked,
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
