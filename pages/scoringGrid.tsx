import Image, { StaticImageData } from "next/image";
import cone from "../styles/img/cone.png";
import cube from "../styles/img/cube.png";
import styles from "../styles/Field.module.css";
import { Popover, Text, Button, Container, Grid } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useDetectClickOutside } from "react-detect-click-outside";
import { score } from "../neo4j/AddData";

function getLevel({ col, isBlue }: { col: number; isBlue: boolean }) {
  let pos = 1;
  if (col % 3 == 0) {
    pos = isBlue ? 0 : 2;
  } else if ((col + 1) % 3 == 0) {
    pos = isBlue ? 2 : 0;
  }

  return pos;
}

function getPosition({ pos, isBlue }: { pos: number; isBlue: boolean }) {
  return isBlue ? Math.floor(pos / 3) + 1 : 3 - Math.floor(pos / 3);
}

export default function ScoringGrid({
  addGamePiece,
  pickedupGamePiece,
  scoreGamePiece,
  isBlueAlliance,
}: {
  addGamePiece: Function;
  pickedupGamePiece: String;
  scoreGamePiece: Function;
  isBlueAlliance: boolean;
}) {
  //score, auto vs teleop for scores
  const coneCol = [0, 1, 2, 6, 7, 8];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
      {new Array(0, 1, 2).map((grid) => {
        return (
          <div key={grid}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                height: "max-content",
              }}
            >
              {new Array(0, 1, 2, 3, 4, 5, 6, 7, 8).map((pos) => {
                let gamePiece = coneCol.includes(pos) ? "cone" : "cube";

                // hybrid nodes
                if (pos % 3 == (isBlueAlliance ? 0 : 2)) {
                  gamePiece = pickedupGamePiece + "";
                }

                return (
                  <div key={pos}>
                    <Box
                      gamePiece={gamePiece}
                      level={getLevel({ col: pos, isBlue: isBlueAlliance })}
                      grid={grid}
                      addGamePiece={addGamePiece}
                      pickedupGamePiece={pickedupGamePiece}
                      scoreGamePiece={scoreGamePiece}
                      position={getPosition({
                        pos: pos,
                        isBlue: isBlueAlliance,
                      })}
                      isBlueAlliance={isBlueAlliance}
                    ></Box>
                  </div>
                );
              })}
            </div>
            {/* {row < 2 ? <hr style={{borderLeft: "6px solid white", height: 'fit-content'}}></hr> : null} */}
          </div>
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
  position: number;
  isBlueAlliance: boolean;
}

function Box({
  pickedupGamePiece,
  gamePiece,
  level,
  addGamePiece,
  grid,
  scoreGamePiece,
  position,
  isBlueAlliance,
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
                  scoreGamePiece(level, true, grid, position, false);
                } else if (gamePiece == "cube" && pickedupGamePiece == "cube") {
                  setContent(cube);
                  scoreGamePiece(level, false, grid, position, false);
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
              scoreGamePiece(level, gamePiece, grid, true, position);
              setContent(undefined);
            }
          }}
        >
          {content ? (
            <Image src={content} alt="game piece" width={18}></Image>
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
              width={20}
              onClick={() => {
                if (content == cone) {
                  scoreGamePiece(
                    level,
                    gamePiece == "cone",
                    grid,
                    true,
                    position
                  );
                  setContent(undefined);
                } else {
                  setContent(cone);
                  scoreGamePiece(
                    level,
                    gamePiece == "cone",
                    grid,
                    false,
                    position
                  );
                }
                close();
              }}
            ></Image>
            <Image
              src={cube}
              alt="gamepiece"
              width={20}
              onClick={() => {
                if (content == cube) {
                  setContent(undefined);
                  scoreGamePiece(
                    level,
                    gamePiece == "cube",
                    grid,
                    true,
                    position
                  );
                } else {
                  setContent(cube);
                  scoreGamePiece(
                    level,
                    gamePiece == "cube",
                    grid,
                    false,
                    position
                  );
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
