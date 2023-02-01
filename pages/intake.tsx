import { Button, Footer, Group, Text } from "@mantine/core";
import Image from "next/image";
import myPic from "../assets/FRCGameField.jpg";
import React, { useState } from "react";

export default function Home() {
  const [coords, setCoords] = useState<any>([]);
  const [mousePos, setMousePos] = useState<any>({});
  const [gamePiece, setGamePiece] = useState(0);

  function handleClick(e: any) {
    let bounds = e.target.getBoundingClientRect();
    console.log(bounds.top);
    if (gamePiece != 0) {
      let temp = [...coords, [mousePos.x - 6, mousePos.y + 12, gamePiece]];
      setCoords(temp);
    }
    console.log(coords);
  }

  function handleConeClick() {
    setGamePiece(1);
  }

  function handleNoneClick() {
    setGamePiece(0);
  }

  function handleCubeClick() {
    setGamePiece(2);
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
      <Group position="left" spacing="xl">
        <Button onClick={() => handleCubeClick()}> Cube</Button>
        <Button onClick={() => handleConeClick()}> Cone</Button>
        <Button onClick={() => handleNoneClick()}> None</Button>
      </Group>
      <div style={{ position: "relative" }}>
        <Image
          onClick={(e) => handleClick(e)}
          src={myPic}
          width={800}
          style={{ position: "absolute" }}
          alt="image"
        />
        {coords.map((coord: any) => {
          return (
            <text
              style={{
                left: coord[0],
                top: coord[1] - 85 - 37,
                position: "absolute",
              }}
            >
              {coord[2] === 2 ? "🧊" : ""}
              {coord[2] === 1 ? "⚠" : ""}
            </text>
          );
        })}
      </div>
      <Footer height={600}>
        {coords.map((coord: any) => {
          return (
            <span>
              ({coord[0]}, {coord[1] - 85 - 37}, {coord[2] === 2 ? "Cube" : ""}
              {coord[2] === 1 ? "Cone" : ""}){" "}
            </span>
          );
        })}
      </Footer>
    </div>
  );
}
