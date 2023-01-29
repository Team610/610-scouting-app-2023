import {
  Button,
  Footer,
  Group,
  Text
} from "@mantine/core"
import styles from '../styles/Home.module.css'
import Image from "next/image";
import myPic from '../assets/FRCGameField.jpg'
import React from "react";

export default function Home() {
  const [coords, setCoords] = React.useState([]);
  const [mousePos, setMousePos] = React.useState({});
  const [gamePiece, setGamePiece] = React.useState(0);

  function handleClick(){
    if(gamePiece!=0){
      setCoords(coords => [...coords, [mousePos.x,mousePos.y,gamePiece]]);
    }
    console.log(coords);
  }

  function handleConeClick(){
    setGamePiece(1); 
  }

  function handleNoneClick(){
    setGamePiece(0);
  }

  function handleCubeClick(){
    setGamePiece(2);
  }

  React.useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener(
        'mousemove',
        handleMouseMove
      );
    };
  }, []);

  return (
    <div>
      <Group position="left" spacing="xl" >
        <Button onClick={()=> handleCubeClick()}> Cube</Button>
        <Button onClick={()=> handleConeClick()}> Cone</Button>
        <Button onClick={()=> handleNoneClick()}> None</Button>
      </Group>
      <div style={{position: "relative"}}>
        <Image  onClick={()=> handleClick()}
          src = {myPic}
          width = "900"
          left = "0"
          up = "85"
          position = "absolute"
        />
        {coords.map((coord) => {
            return (
                <text style={{left: coord[0], top:coord[1]-85-37, position: "absolute"}}>
                  {coord[2]===2 ? '🧊' : ''}
                  {coord[2]===1 ? '⚠':''}
                </text>
            )
        })}
      </div>
      <Footer height={130} p="md">
          {coords.map((coord) => {
            return <span>({coord[0]}, {coord[1]-85-37})    </span>
          })}
      </Footer>
    </div>
  );
}
