import Image, { StaticImageData } from "next/image";
import cone from "../styles/img/cone.png";
import cube from "../styles/img/cube.png";
import styles from "../styles/Field.module.css";
import { Popover, Text, Button, Container, Grid } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useDetectClickOutside } from "react-detect-click-outside";
import { score } from "../neo4j/AddData";

export default function ScoringGrid({
  addGamePiece,
  pickedupGamePiece,
  scoreGamePiece,
}: {
  addGamePiece: Function;
  pickedupGamePiece: String;
  scoreGamePiece: Function;
}) {
  //score, auto vs teleop for scores
  const coneCol = [0, 2, 3, 5, 6, 8];
  return (
    <div style={{ display: "flex", justifyContent: "space-evenly" }}>
      {new Array(0, 1, 2).map((item, row) => {
        return (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                height: "max-content",
              }}
            >
              {new Array(9).fill(0).map((item2, col) => {
                let gamePiece = "cube";
                if (coneCol.includes(col)) {
                  gamePiece = "cone";
                }
                if (col > 5) {
                  gamePiece = pickedupGamePiece + "";
                }
                return (
                  <div>
                    <Box
                      gamePiece={gamePiece}
                      level={3 - Math.floor(col / 3)}
                      grid={item}
                      addGamePiece={addGamePiece}
                      pickedupGamePiece={pickedupGamePiece}
                      scoreGamePiece={scoreGamePiece}
                    ></Box>
                  </div>
                );
              })}
            </div>
            {/* {row < 2 ? <hr style={{borderLeft: "6px solid white", height: 'fit-content'}}></hr> : null} */}
          </>
        );
      })}
    </div>
  );
}

interface BoxProps {
  gamePiece: String;
  level: number;
  addGamePiece: Function;
  grid: number;
  pickedupGamePiece: String;
  scoreGamePiece: Function;
}

function Box({
  pickedupGamePiece,
  gamePiece,
  level,
  addGamePiece,
  grid,
  scoreGamePiece,
}: BoxProps) {
  const [content, setContent] = useState<StaticImageData>();
  const [opened, { close, open }] = useDisclosure(false);
  const ref = useDetectClickOutside({ onTriggered: close });
  return (
    <>
      <div
        style={{ width: "fit-content", display: "flex", flexDirection: "row" }}
        ref={ref}
      >
        <div
          className={styles.box}
          onClick={() => {
            //if cell is empty
            if (content == undefined) {
              //if gamepiece can be anything, open up the option menu
              if (gamePiece == "any" && pickedupGamePiece != "nothing") {
                opened ? close() : open();
              }
              //if gamepiece is a cone place a cone in the box
              else {
                if (gamePiece == "cone" && pickedupGamePiece == "cone") {
                  setContent(cone);
                  scoreGamePiece(level, true, grid);
                } else if (gamePiece == "cube" && pickedupGamePiece == "cube") {
                  setContent(cube);
                  scoreGamePiece(level, false, grid);
                }
              }
            }
            //if cell is not empty, the game piece can be anything, and it already has a gamepiece in it
            else {
              if (gamePiece == "any") {
                console.log("made it");
                //open up menu to change selection
                open();
              }
              scoreGamePiece(level, gamePiece, grid, true);
              setContent(undefined);
            }
          }}
        >
          {content ? (
            <Image src={content} alt="game piece" width={30}></Image>
          ) : null}
        </div>
      </div>
      <div>
        {opened ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              paddingTop: "10px",
            }}
          >
            <Image
              src={cone}
              alt="gamepiece"
              width={30}
              onClick={() => {
                if (content == cone) {
                  scoreGamePiece(level, gamePiece == "cone", grid, true);
                  setContent(undefined);
                } else {
                  setContent(cone);
                  scoreGamePiece(level, gamePiece == "cone", grid, false);
                }
                close();
              }}
            ></Image>
            <Image
              src={cube}
              alt="gamepiece"
              width={30}
              onClick={() => {
                if (content == cube) {
                  setContent(undefined);
                  scoreGamePiece(level, gamePiece == "cube", grid, true);
                } else {
                  setContent(cube);
                  scoreGamePiece(level, gamePiece == "cube", grid, false);
                }
                close();
              }}
            ></Image>
          </div>
        ) : null}
      </div>
    </>
  );
}
