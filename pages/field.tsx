import Image, { StaticImageData } from "next/image";
import field from "../styles/img/field.png"
import cone from "../styles/img/cone.png"
import cube from "../styles/img/cube.png"
import styles from "../styles/Field.module.css"
import { Popover, Text, Button, Container, Grid } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import { useDetectClickOutside } from "react-detect-click-outside";

export default function Field(){
    return(
        <>
            <Boxes />
        </>
    )
}

function Boxes(){
    //score, auto vs teleop for scores
    const coneCol = [0, 2, 3, 5, 6, 8]
    return(
        <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
            {new Array(0, 1, 2).map((item, row) => {
                return(
                    <>
                        <div style={{display: 'grid', gridTemplateColumns: "repeat(3, 1fr)", height: "max-content"}}>
                            {new Array(9).fill(0).map((item2, col) => {
                                let gamePiece = "cube"
                                if(coneCol.includes(col)){
                                    gamePiece = "cone"
                                }
                                if (col > 5){
                                    gamePiece = "any"
                                }
                                return(
                                    <div>
                                        <Box gamePiece={gamePiece} level={item}></Box>
                                    </div>
                                )
                            })}
                        </div>
                        {/* {row < 2 ? <hr style={{borderLeft: "6px solid white", height: 'fit-content'}}></hr> : null} */}
                    </>
                )
            })}
        </div>
    )
}

interface BoxProps{
    gamePiece: String
    level: number
}

function Box({gamePiece, level}: BoxProps) {
    const [content, setContent] = useState<StaticImageData>()
    const [opened, { close, open }] = useDisclosure(false);

    return (
        <>
            <div style={{width: "fit-content", display: "flex", flexDirection: "row"}}>
                <div className={styles.box} 
                onClick={() => {
                    if(content == undefined){
                        if (gamePiece == 'any'){
                            opened ? close() : open()
                        }
                        else if (gamePiece == 'cone'){
                            setContent(cone)
                        }
                        else{
                            setContent(cube)
                        }
                    }
                    else{
                        if(gamePiece == "any"){
                            open()
                        }
                        setContent(undefined)
                    }
                    console.log(gamePiece, level)
                    // content != undefined ? setContent(undefined) : setContent(gamePiece == 'cone' ? cone : gamePiece == 'cube' ? cube : undefined)
                    // close
                }}>
                    {content ? 
                        <Image src={content} alt="game piece" width={30}></Image> : null
                    }
                </div>
            </div>
            <div>
                {opened ? 
                <div style={{display: 'flex', justifyContent: 'center', gap: '10px', paddingTop: '10px'}}>
                    <Image src={cone} alt="gamepiece" width={30} onClick={() => {
                        content == cone ? setContent(undefined) : setContent(cone)
                        close()
                    }}></Image>
                    <Image src={cube} alt="gamepiece" width={30} onClick={() => {
                        content == cube ? setContent(undefined) : setContent(cube)
                        close()
                    }}></Image>
                </div> : null}
            </div>
        </>
    );
  }