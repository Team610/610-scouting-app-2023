import { Button, Footer, Group, Text } from "@mantine/core";
import Image, { StaticImageData } from "next/image";
import cone from "../styles/img/cone.png";
import cube from "../styles/img/cube.png";
import myPic from "../assets/FRCGameField.jpg";
import React, { use, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Nothing_You_Could_Do, Piedra } from "@next/font/google";


export interface IntakeLocation {
  left: number;
  top: number;
  gamePiece: string;
}

export default function Home({gamePiece, setGamePiece} : {gamePiece: String, setGamePiece : Function}) {
  let [current, setCurrent] = useState<any>([[]]);
  let [mousePos, setMousePos] = useState<any>({});

  const [gameList, setGameList] = useState<any>([[{left: 450, top: 200, gamePiece: "cone"}, {left: 400, top: 200, gamePiece: "cone"}], [{left: 450, top: 250, gamePiece: "cone"}, {left: 400, top: 250, gamePiece: "cone"}], [{left: 450, top: 300, gamePiece: "cone"}, {left: 400, top: 300, gamePiece: "cone"}], [{left: 450, top: 350, gamePiece: "cone"}, {left: 400, top: 350, gamePiece: "cone"}]]);

  const [selectedOption, setSelectedOption] = useState('');

  const [opened, { close, open }] = useDisclosure(false);



  function handleClick(e: any) {
    let obj = {
      left: mousePos.x,
      top: mousePos.y,
      gamePiece: "",
    };
    let temp = [...current, obj];
    setCurrent(temp);
    open();
  }

  function pieceSelected(x: any) {
    let temp = current;
    current[current.length - 1].gamePiece = x;
    setCurrent(temp);
    close();
  }

  function clear() {
    let temp = [[]];
    setCurrent(temp);
    console.log('tried clear');
  }

  const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    console.log('reached handle change')
    setSelectedOption(event.target.value);

    if (event.target.value == "Clear"){
      clear();
    } else if (parseInt(event.target.value.toString()) >= 0){
      setCurrent(gameList[parseInt(event.target.value.toString())]); 
    }
  };


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
        <Button onClick={() => clear()}> Clear</Button>
        <select value={selectedOption} onChange={handleChange}>
          <option value="">Match Selection</option>
          <option value="0" >Game 1</option>
          <option value="1" >Game 2</option>
          <option value="2" >Game 3</option>
          <option value="3" >Game 4</option>
          <option value="Clear" >Clear</option>
        </select>
      </Group>
      <div style={{ position: "relative" }}>
        <Image
          onClick={(e) => handleClick(e)}
          src={myPic}
          width={800}
          style={{ position: "absolute" }}
          alt="image"
        />
      </div>
      {current.map((coord: IntakeLocation, idx: number) => {
        if (!opened || idx !== current.length - 1) {
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
      {opened && gamePiece == "nothing"? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            paddingTop: "10px",
            left: current[current.length - 1].left - 45,
            top: current[current.length - 1].top - 40,
            position: "absolute",
          }}>
          <GamePieceSelect pieceSelected={pieceSelected} gamePiece={gamePiece} setGamePiece={setGamePiece}/>

        </div>
      ) : null}
    </div>
  );
}
function GamePieceSelect({ pieceSelected, gamePiece, setGamePiece}: { pieceSelected: Function, gamePiece: String, setGamePiece: Function }) {
  return (
    <div>
      <Image
        src={cone}
        alt="gamepiece"
        width={30}
        onClick={() => {
          setGamePiece("cone") 
          pieceSelected("cone")
        }}
      ></Image>
      <Image
        src={cube}
        alt="gamepiece"
        width={30}
        onClick={() => {
          setGamePiece("cube") 
          pieceSelected("cube")
        }}
      ></Image>
    </div>
  );
}