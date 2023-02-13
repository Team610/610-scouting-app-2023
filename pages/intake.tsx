import { Button, Footer, Group, Text } from "@mantine/core";
import Image from "next/image";
import myPic from "../assets/FRCGameField.jpg";
import React, { use, useState } from "react";



export default function Home() {
  let [current, setCurrent] = useState<any>([[]]);
  let [mousePos, setMousePos] = useState<any>({});
  let [gamePiece, setGamePiece] = useState(0);

  const [gameList, setGameList] = useState<any>([[[450, 300, 2], [500, 300, 2], [400, 300, 2], [350, 300, 2], [300, 300, 2]], [[450, 250, 2], [500, 250, 2], [400, 250, 2], [350, 250, 2], [300, 250, 2]], [[450, 200, 2], [500, 200, 2], [400, 200, 2], [350, 200, 2], [300, 200, 2]], [[450, 400, 2], [500, 400, 2], [400, 400, 2], [350, 400, 2], [300, 400, 2]]]);
  
  const [selectedOption, setSelectedOption] = useState('');

  function handleClick(e: any) {
    let bounds = e.target.getBoundingClientRect();
    console.log(bounds.top);
    if (gamePiece != 0) {
      let temp = [...current, [mousePos.x - 6, mousePos.y + 12, gamePiece]];
      setCurrent(temp);
    }
    console.log(current);
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
        <Button onClick={() => handleCubeClick()}> Cube</Button>
        <Button onClick={() => handleConeClick()}> Cone</Button>
        <Button onClick={() => handleNoneClick()}> None</Button>
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
        {current.map((coord: any) => { // this line for some reason produces an error when trying to switch
          return (                     // to a game prior to clearing the board first even when the board is empty
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
        {current.map((coord: any) => {
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
