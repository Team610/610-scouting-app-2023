import Image, { StaticImageData } from "next/image";
import cone from "../styles/img/cone.png";
import cube from "../styles/img/cube.png";
import myPic from "../styles/img/FRCGameField.png";
import React, { use, useRef, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useDetectClickOutside } from "react-detect-click-outside";
import { Button } from "@mantine/core";

export interface IntakeLocation {
  left: number;
  top: number;
  gamePiece: string;
}

export default function Home({
  gamePiece,
  setGamePiece,
  addGamePiece,
  blueAllaince,
}: {
  gamePiece: String;
  setGamePiece: Function;
  addGamePiece: Function;
  blueAllaince: boolean;
}) {
  let [locations, setLocations] = useState<any>([[]]);
  let [mousePos, setMousePos] = useState<any>({});
  let [autoButton, setAutoButtons] = useState(true);
  let [selecting, setSelecting] = useState(false);

  const [opened, { close, open }] = useDisclosure(false);

  function handleClickOutside() {
    if (!selecting) {
      if (opened) {
        let temp = [...locations].slice(0, locations.length - 1);
        setLocations(temp);
      }
      close();
    }
  }

  const ref = useDetectClickOutside({ onTriggered: handleClickOutside });

  function setMouse(event: any) {
    if (gamePiece == "nothing") {
      setMousePos({ x: event.clientX, y: event.clientY });
    }
  }

  function handleClick(e: any, substation: string) {
    let obj = {
      left: e.clientX,
      top: e.clientY,
      gamePiece: "",
      substation: substation,
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
    setSelecting(true);
    open();
  }

  function pieceSelected(x: any) {
    let temp = locations;
    let curr = locations[locations.length - 1];
    locations[locations.length - 1].gamePiece = x;
    setLocations(temp);
    if (curr.substation.includes(blueAllaince ? "blue" : "red")) {
      setAutoButtons(false);
    }
    addGamePiece(x == "cone", curr.substation);
    setSelecting(false);
    close();
  }

  function clear() {
    let temp = [[]];
    setLocations(temp);
    console.log("tried clear");
  }

  // const handleChange = (event: {
  //   target: { value: React.SetStateAction<string> };
  // }) => {
  //   console.log("reached handle change");
  //   setSelectedOption(event.target.value);

  //   if (event.target.value == "Clear") {
  //     clear();
  //   } else if (parseInt(event.target.value.toString()) >= 0) {
  //     setLocations(gameList[parseInt(event.target.value.toString())]);
  //   }
  // };

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

  let leftAuto = 520;
  let topAuto = 140;

  let leftShelf = 0;
  let topShelf = 30;

  let leftSub = 140;
  let topSub = 0;

  let topFloor = 140;
  let leftFloor = 315;

  if (blueAllaince) {
    leftAuto = 70;
    leftShelf = 627;
    leftSub = 440;
  }

  function determineLocation() {
    let left = 0;
    let top = 0;
    let sub = locations[locations.length - 1].substation;
    if (sub.includes("red") || sub.includes("blue")) {
      if (sub.includes("top")) {
        top = topAuto;
      }
      if (sub.includes("middle")) {
        top = topAuto + 50;
      }
      if (sub.includes("bottom")) {
        top = topAuto + 100;
      }
      left = !blueAllaince ? leftAuto - 120 : leftAuto + 80;
      return [top, left];
    }
    if (sub == "gate") {
      return [topSub + 60, leftSub];
    }
    if (sub == "shelf") {
      return [topShelf + 50, blueAllaince ? leftShelf - 100 : leftShelf + 50];
    } else {
      return [topFloor - 50, leftFloor - 10];
    }
  }

  return (
    <div ref={ref}>
      <div>
        <Image
          src={myPic}
          width={700}
          height={356}
          alt="image"
          // style={{ transform: "rotate(180deg)" }}
        />
      </div>
      {autoButton ? (
        <>
          <Button
            style={{
              position: "absolute",
              left: `${leftAuto}px`,
              top: `${topAuto}px`,
            }}
            onClick={(e) => {
              handleClick(e, (blueAllaince ? "blue" : "red") + " top");
            }}
          >
            Top
          </Button>
          <Button
            style={{
              position: "absolute",
              left: `${leftAuto}px`,
              top: `${topAuto + 50}px`,
            }}
            onClick={(e) => {
              handleClick(e, (blueAllaince ? "blue" : "red") + " middle");
            }}
          >
            Middle
          </Button>
          <Button
            style={{
              position: "absolute",
              left: `${leftAuto}px`,
              top: `${topAuto + 100}px`,
            }}
            onClick={(e) => {
              handleClick(e, (blueAllaince ? "blue" : "red") + " bottom");
            }}
          >
            Bottom
          </Button>{" "}
        </>
      ) : (
        <>
          <Button
            style={{
              top: `${topSub}px`,
              left: `${leftSub}px`,
              position: "absolute",
            }}
            onClick={(e) => {
              gamePiece == "nothing" ? handleClick(e, "gate") : null;
            }}
          >
            Substation
          </Button>
          <Button
            style={{
              top: `${topShelf}px`,
              left: `${leftShelf}px`,
              position: "absolute",
            }}
            onClick={(e) => {
              gamePiece == "nothing" ? handleClick(e, "shelf") : null;
            }}
          >
            Shelf
          </Button>
          <Button
            style={{
              top: `${topFloor}px`,
              left: `${leftFloor}px`,
              position: "absolute",
            }}
            onClick={(e) => {
              gamePiece == "nothing" ? handleClick(e, "floor") : null;
            }}
          >
            Floor
          </Button>
        </>
      )}
      {/* {locations.map((coord: IntakeLocation, idx: number) => {
        //always starts with empty arrow so ignore the first index
        //also ignore the last index which is yet to be assigned a game piece
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
              width={20}
              key={idx}
            ></Image>
          );
        }
      })} */}
      {opened && gamePiece == "nothing" ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            paddingTop: "10px",
            left: determineLocation()[1],
            top: determineLocation()[0],
            position: "absolute",
          }}
        >
          <GamePieceSelect
            pieceSelected={pieceSelected}
            setGamePiece={setGamePiece}
          />
        </div>
      ) : null}
    </div>
  );
}
function GamePieceSelect({
  pieceSelected,
  setGamePiece,
}: {
  pieceSelected: Function;
  setGamePiece: Function;
}) {
  return (
    <>
      <Button
        variant="subtle"
        compact
        onClick={() => {
          setGamePiece("cone");
          pieceSelected("cone");
        }}
        style={{ height: "fit-content", backgroundColor: "none" }}
      >
        <Image src={cone} alt="gamepiece" width={40}></Image>
      </Button>
      <Button
        variant="subtle"
        compact
        onClick={() => {
          setGamePiece("cube");
          pieceSelected("cube");
        }}
        style={{ height: "fit-content", backgroundColor: "none" }}
      >
        <Image src={cube} alt="gamepiece" width={40}></Image>
      </Button>
    </>
  );
}
