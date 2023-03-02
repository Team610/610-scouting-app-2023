import { useEffect, useState } from "react";
import { Button, Checkbox } from "@mantine/core";
import ChargeStation from "./ChargeStation";
import Intake from "./intake";
import ScoringGrid from "./scoringGrid";
import { clientCycle, submitMatch } from "../neo4j/SubmitMatch";
import { convertCycleServer } from "../lib/clientCycleToServer";
import { useRouter } from "next/router";

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

  const [time, setTime] = useState(15);

  // redirect page to "TeleOp" after 10 seconds while displaying remaining time on page
  useEffect(() => {
    const timer = setTimeout(() => {
      setTime(time - 1);
    }, 1000);
    if (time === 0) {
      setGameState("teleop");
      setChargingStation(deafultChargingStation);
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
    remove: boolean | undefined,
    position: number
  ) {
    let temp = gamePieces;
    let obj = temp[gamePieces.length - 1];
    obj.auto = gameState == "auto";
    obj.cone = cone;
    obj.grid = grid;
    obj.level = level;
    obj.position = position;

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
          <Intake
            gamePiece={gamePiece}
            setGamePiece={setGamePiece}
            addGamePiece={addGamePiece}
          />
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
          <LinkScored />
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
      <ScoringGrid
        addGamePiece={addGamePiece}
        pickedupGamePiece={gamePiece}
        scoreGamePiece={scoreGamePiece}
      />
      {gameState == "teleop" ? (
        <Button
          onClick={async () => {
            await submitMatch({
              team: 610,
              allies: [1, 2],
              enemies: [3, 4],
              match: 'Q37',
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
