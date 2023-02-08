import { Button, Footer, Group, Text } from "@mantine/core";
import Image, { StaticImageData } from "next/image";
import cone from "../styles/img/cone.png";
import cube from "../styles/img/cube.png";
import myPic from "../assets/FRCGameField.jpg";
import React, { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Piedra } from "@next/font/google";

export interface IntakeLocation {
  left: number;
  top: number;
  gamePiece: string;
}

export default function Home() {
  const [coords, setCoords] = useState<IntakeLocation[]>([]);
  const [mousePos, setMousePos] = useState<any>({});
  const [opened, { close, open }] = useDisclosure(false);

  function handleClick(e: any) {
    let obj = {
      left: mousePos.x,
      top: mousePos.y,
      gamePiece: "",
    };
    let temp = [...coords, obj];
    setCoords(temp);
    open();
  }

  function pieceSelected(x: any) {
    let temp = coords;
    coords[coords.length - 1].gamePiece = x;
    setCoords(temp);
    close();
  }

  React.useEffect(() => {
    const handleMouseMove = (event: any) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div>
      <div style={{ position: "relative" }}>
        <Image
          onClick={(e) => handleClick(e)}
          src={myPic}
          width={800}
          style={{ position: "absolute" }}
          alt="image"
        />
      </div>
      {coords.map((coord: IntakeLocation, idx) => {
        if (!opened || idx !== coords.length - 1) {
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

      <div
        style={{
          top: 80,
          left: 850,
          width: 500,
          height: 400,
          position: "absolute",
        }}
      ></div>
      {opened ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            paddingTop: "10px",
            left: coords[coords.length - 1].left - 45,
            top: coords[coords.length - 1].top - 40,
            position: "absolute",
          }}
        >
          <GamePieceSelect pieceSelected={pieceSelected} />
        </div>
      ) : null}
    </div>
  );
}

function GamePieceSelect({ pieceSelected }: { pieceSelected: Function }) {
  return (
    <div>
      <Image
        src={cone}
        alt="gamepiece"
        width={30}
        onClick={() => {
          pieceSelected("cone");
        }}
      ></Image>
      <Image
        src={cube}
        alt="gamepiece"
        width={30}
        onClick={() => {
          pieceSelected("cube");
        }}
      ></Image>
    </div>
  );
}
