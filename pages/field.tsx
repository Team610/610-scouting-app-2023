import Image, { StaticImageData } from "next/image";
import field from "../styles/img/field.png";
import cone from "../styles/img/cone.png";
import cube from "../styles/img/cube.png";
import styles from "../styles/Field.module.css";
import { Popover, Text, Button, Container, Grid } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useDetectClickOutside } from "react-detect-click-outside";
import { GamePiece } from "./match";

export default function Field({ addGamePiece }: { addGamePiece: Function }) {
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
                  gamePiece = "any";
                }
                return (
                  <div>
                    <Box
                      gamePiece={gamePiece}
                      level={3 - Math.floor(col / 3)}
                      grid={item}
                      addGamePiece={addGamePiece}
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
}

function Box({ gamePiece, level, addGamePiece, grid }: BoxProps) {
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
              if (gamePiece == "any") {
                opened ? close() : open();
              }
              //if gamepiece is a cone place a cone in the box
              else {
                if (gamePiece == "cone") {
                  setContent(cone);
                  addGamePiece(false, level, true, grid);
                } else {
                  setContent(cube);
                  addGamePiece(false, level, false, grid);
                }
              }
            }
            //if cell is not empty, the game piece can be anything, and it already has a gamepiece in it
            else {
              if (gamePiece == "any") {
                //open up menu to change selection
                open();
              }
              addGamePiece(false, level, gamePiece, grid, true);
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
                  addGamePiece(false, level, gamePiece == "cone", grid, true);
                  setContent(undefined);
                } else {
                  setContent(cone);
                  addGamePiece(false, level, gamePiece == "cone", grid, false);
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
                  addGamePiece(false, level, gamePiece == "cube", grid, true);
                } else {
                  setContent(cube);
                  addGamePiece(false, level, gamePiece == "cube", grid, false);
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
