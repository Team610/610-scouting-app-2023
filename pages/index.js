import {
  Footer,
  Text
} from "@mantine/core"
import styles from '../styles/Home.module.css'
import Image from "next/image";
import myPic from '../assets/FRCGameField.jpg'
import React from "react";

export default function Home() {
  const [coords, setCoords] = React.useState([]);
  const [mousePos, setMousePos] = React.useState({});

  function handleClick(){
    setCoords(coords => [...coords, mousePos]);
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
      <div style={{position: "relative"}}>
        <Image  onClick={()=> handleClick()}
          src = {myPic}
          width = "1000"
          left = "0"
          up = "85"
          position = "absolute"
        />
        {coords.map((coord) => {
            return (
              <div style={{left: coord.x, top:coord.y-85, position: "absolute"}}>
                🧊
              </div>
            )
        })}
      </div>
      
      <Footer height={130} p="md">
          {coords.map((coord) => {
            return <span>({coord.x}, {coord.y-85})    </span>
          })}
      </Footer>
    </div>
  );
}
