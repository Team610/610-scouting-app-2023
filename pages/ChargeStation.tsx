import { useState } from 'react';
import { Checkbox, Switch } from '@mantine/core';
import { Text } from '@mantine/core';

let isDocked = false;

function AutoOuTele({ setMatchState }: { setMatchState: Function }) {
    const [checked, setChecked] = useState(false);
    setMatchState(checked ? true : false);

    return (
        <>
            <div style={{ display: "flex", flexDirection: "row", gap: "15px", alignItems: "center" }}>
                <Text style={{ color: "white", fontSize: "30px", fontFamily: "arial" }} >Auto</Text>
                <Switch checked={checked} onChange={(event) => setChecked(event.currentTarget.checked)} />
                <Text style={{ color: "white", fontSize: "30px", fontFamily: "arial" }} >TeleOP</Text>
            </div>
        </>
    );
}
function Dock({ name, setPoints, matchState }: { name: String, setPoints: Function, matchState: boolean }) {

    const [checked, setChecked] = useState(false);

    if (checked && name === "Docked") {
        setPoints(!matchState ? 8 : 6)
        isDocked = true
    } else if (name === "Docked") {
        setPoints(0)
        isDocked = false
    }
    if (checked && isDocked && name === "Engaged") {
        setPoints(!matchState ? 12 : 10)
    } else if (isDocked && name === "Engaged") {
        setPoints(!matchState ? 8 : 6)
    }
    return (
        <>
            <Checkbox
                checked={checked} onChange={(event) => setChecked(event.currentTarget.checked)}
                sx={{ "& .mantine-Checkbox-label": { color: "white", fontFamily: "arial", fontSize: "20px" } }}
                label={name}
            />
        </>
    );
}

export default function Charge() {
    const [isItTele, setMatchState] = useState(false);
    const [pointPlayer1, setPointsForPlayer1] = useState(0);
    const [pointPlayer2, setPointsForPlayer2] = useState(0);
    const [pointPlayer3, setPointsForPlayer3] = useState(0);

    return (
        <>

            <div style={{ margin: "30px+50px", display: "flex", justifyContent: "center" }}>
                <AutoOuTele setMatchState={setMatchState} />
            </div>

            
            <div style={{display: "flex", flexDirection: "row", gap: "50px", justifyContent: "center"}}>

                <div>
                    <Text style={{ margin: "20px+50px+15px", fontSize: "18px" }}>Team You're Scouting:</Text>
                    <div style={{ margin: "20px+50px+15px" }}>
                        <Dock name={"Docked"} setPoints={setPointsForPlayer1} matchState={isItTele} />
                    </div>
                    <div style={{ margin: "0px+50px" }}>
                        <Dock name={"Engaged"} setPoints={setPointsForPlayer1} matchState={isItTele} />
                    </div>

                    <Text style={{ margin: "10px+50px", color: "white", fontSize: "20px" }}>Single: {pointPlayer1}</Text>
                </div>

                <div>
                    <Text style={{ margin: "20px+50px+15px", fontSize: "18px" }}>Team 2:</Text>
                    <div style={{ margin: "20px+50px+15px" }}>
                        <Dock name={"Docked"} setPoints={setPointsForPlayer2} matchState={isItTele} />
                    </div>
                    <div style={{ margin: "0px+50px" }}>
                        <Dock name={"Engaged"} setPoints={setPointsForPlayer2} matchState={isItTele} />
                    </div>

                    <Text style={{ margin: "10px+50px", color: "white", fontSize: "20px" }}>Single: {pointPlayer2}</Text>
                </div>

                <div>
                    <Text style={{ margin: "20px+50px+15px", fontSize: "18px" }}>Team 3:</Text>
                    <div style={{ margin: "20px+50px+15px" }}>
                        <Dock name={"Docked"} setPoints={setPointsForPlayer3} matchState={isItTele} />
                    </div>
                    <div style={{ margin: "0px+50px" }}>
                        <Dock name={"Engaged"} setPoints={setPointsForPlayer3} matchState={isItTele} />
                    </div>

                    <Text style={{ margin: "10px+50px", color: "white", fontSize: "20px" }}>Single: {pointPlayer3}</Text>
                </div>


            </div>



            <Text style={{ margin: "10px+50px", color: "white", fontSize: "20px", display: "flex", justifyContent: "center" }}>Team: {pointPlayer1 + pointPlayer2 + pointPlayer3}</Text>
        </>
    );
}

