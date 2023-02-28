import { Button, Footer, Group, Text } from "@mantine/core";
import Image, { StaticImageData } from "next/image";
import cone from "../styles/img/cone.png";
import cube from "../styles/img/cube.png";
import myPic from "../assets/FRCGameField.png";
import React, { use, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Nothing_You_Could_Do, Piedra } from "@next/font/google";

export interface IntakeLocation {
  left: number;
  top: number;
  gamePiece: string;
}

export default function Home({
  gamePiece,
  setGamePiece,
  addGamePiece,
}: {
  gamePiece: String;
  setGamePiece: Function;
  addGamePiece: Function;
}) {
  let [locations, setLocations] = useState<any>([[]]);
  let [mousePos, setMousePos] = useState<any>({});

  const [gameList, setGameList] = useState<any>([
    [
      { left: 450, top: 200, gamePiece: "cone" },
      { left: 400, top: 200, gamePiece: "cone" },
    ],
    [
      { left: 450, top: 250, gamePiece: "cone" },
      { left: 400, top: 250, gamePiece: "cone" },
    ],
    [
      { left: 450, top: 300, gamePiece: "cone" },
      { left: 400, top: 300, gamePiece: "cone" },
    ],
    [
      { left: 450, top: 350, gamePiece: "cone" },
      { left: 400, top: 350, gamePiece: "cone" },
    ],
  ]);

  const [selectedOption, setSelectedOption] = useState("");

  const [opened, { close, open }] = useDisclosure(false);

  function setMouse(event: any) {
    if (gamePiece == "nothing") {
      setMousePos({ x: event.clientX, y: event.clientY });
    }
  }

  function handleClick(e: any) {
    let obj = {
      left: mousePos.x,
      top: mousePos.y,
      gamePiece: "",
    };
    //removing a game piece
    if (locations[locations.length - 1].gamePiece == "") {
      let temp = [...locations].slice(0, locations.length - 1);
      temp.push(obj);
      setLocations(temp);
    } //adding a game piece
    else {
      let temp = [...locations, obj];
      setLocations(temp);
    }

    open();
  }

  function pieceSelected(x: any) {
    let temp = locations;
    let curr = locations[locations.length - 1];
    locations[locations.length - 1].gamePiece = x;
    setLocations(temp);
    addGamePiece(curr.left, curr.top, x);
    close();
  }

  function clear() {
    let temp = [[]];
    setLocations(temp);
    console.log("tried clear");
  }

  const handleChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    console.log("reached handle change");
    setSelectedOption(event.target.value);

    if (event.target.value == "Clear") {
      clear();
    } else if (parseInt(event.target.value.toString()) >= 0) {
      setLocations(gameList[parseInt(event.target.value.toString())]);
    }
  };

  const onMouseMove = (event: any) => {
    setMouse(event);
  };

  React.useEffect(() => {
    if (gamePiece == "nothing") {
      window.addEventListener("mousemove", onMouseMove);
    } else {
      window.removeEventListener("mousemove", onMouseMove);
    }
  }, [gamePiece]);

  return (
    <>
      {/* <Group position="left" spacing="xl">
        <Button onClick={() => clear()}> Clear</Button>
        <select value={selectedOption} onChange={handleChange}>
          <option value="">Match Selection</option>
          <option value="0">Game 1</option>
          <option value="1">Game 2</option>
          <option value="2">Game 3</option>
          <option value="3">Game 4</option>
          <option value="Clear">Clear</option>
        </select>
      </Group> */}
      <div>
        <Image
          onClick={(e) => {
            gamePiece == "nothing" ? handleClick(e) : null;
          }}
          src={myPic}
          width={800}
          alt="image"
        />
      </div>
      {locations.map((coord: IntakeLocation, idx: number) => {
        if (idx !== 0 && (idx !== locations.length - 1 || !opened)) {
          return (
            <Image
              src={
                coord.gamePiece == "cone"
                  ? cone
                  : coord.gamePiece == "cube"
                  ? cube
                  : ""
              }
              alt="gamepiece"
              style={{
                left: coord.left,
                top: coord.top,
                position: "absolute",
              }}
              width={30}
            ></Image>
          );
        }
      })}
      {opened && gamePiece == "nothing" ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            paddingTop: "10px",
            left: locations[locations.length - 1].left - 45,
            top: locations[locations.length - 1].top - 40,
            position: "absolute",
          }}
        >
          <GamePieceSelect
            pieceSelected={pieceSelected}
            gamePiece={gamePiece}
            setGamePiece={setGamePiece}
          />
        </div>
      ) : null}
    </>
  );
}
function GamePieceSelect({
  pieceSelected,
  gamePiece,
  setGamePiece,
}: {
  pieceSelected: Function;
  gamePiece: String;
  setGamePiece: Function;
}) {
  return (
    <div>
      <Image
        src={cone}
        alt="gamepiece"
        width={30}
        onClick={() => {
          setGamePiece("cone");
          pieceSelected("cone");
        }}
      ></Image>
      <Image
        src={cube}
        alt="gamepiece"
        width={30}
        onClick={() => {
          setGamePiece("cube");
          pieceSelected("cube");
        }}
      ></Image>
    </div>
  );
}
