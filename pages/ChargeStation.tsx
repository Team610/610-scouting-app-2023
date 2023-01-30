import { useState } from 'react';
import { Checkbox, Switch } from '@mantine/core';
import { Text } from '@mantine/core';



function AutoOuTele({ setMatchState }: { setMatchState: Function }) {
    const [checked, setChecked] = useState(false);
    //set the match state to if the match is tele (true) or auto (false)
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
function ChargeScoring({ setPoints, isTele }: { setPoints: Function, isTele: boolean }) {
    //see if the robot is docked
    const [dockCheck, setDockCheck] = useState(false);
    //see if the robot is engaged
    const [engageCheck, setEngageCheck] = useState(false);
    if (dockCheck && !engageCheck) {  //only dock, not engaged
        setPoints(!isTele ? 8 : 6);
    } else if (dockCheck && engageCheck) { //dock and engage
        setPoints(!isTele ? 12 : 10);
    } else { //anything else (not scoring)
        setPoints(0);
    }

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <Checkbox checked={dockCheck} onChange={(event) => setDockCheck(event.currentTarget.checked)}
                    sx={{ "& .mantine-Checkbox-label": { color: "white", fontFamily: "arial", fontSize: "20px" } }} label="Docked" />

                <Checkbox checked={engageCheck} onChange={(event) => setEngageCheck(event.currentTarget.checked)}
                    sx={{ "& .mantine-Checkbox-label": { color: "white", fontFamily: "arial", fontSize: "20px" } }} label="Engaged" />
            </div>

        </>

    );
}

export default function ChargeStation() {
    //sees if the match is in tele
    const [isItTele, setMatchState] = useState(false);
    //tracks points for each teams/players from 1-3
    const [pointPlyr1, setPtsPlyr1] = useState(0);
    const [pointPlyr2, setPtsPlyr2] = useState(0);
    const [pointPlyr3, setPtsPlyr3] = useState(0);

    return (
        <>
            <div style={{ margin: "30px+50px", display: "flex", justifyContent: "center" }}>
                <AutoOuTele setMatchState={setMatchState} />
            </div>

            <div style={{ display: "flex", flexDirection: "row", gap: "50px", justifyContent: "center" }}>

                <div>
                    <Text style={{ margin: "20px+50px+15px", fontSize: "18px" }}>Team You're Scouting:</Text>
                    <div style={{ margin: "20px+50px+15px" }}>
                        <ChargeScoring setPoints={setPtsPlyr1} isTele={isItTele} />
                    </div>
                    <Text style={{ margin: "10px+50px", color: "white", fontSize: "20px" }}>Single: {pointPlyr1}</Text>
                </div>

                <div>
                    <Text style={{ margin: "20px+50px+15px", fontSize: "18px" }}>Team 2:</Text>
                    <div style={{ margin: "20px+50px+15px" }}>
                        <ChargeScoring setPoints={setPtsPlyr2} isTele={isItTele} />
                    </div>
                    <Text style={{ margin: "10px+50px", color: "white", fontSize: "20px" }}>Single: {pointPlyr2}</Text>
                </div>

                <div>
                    <Text style={{ margin: "20px+50px+15px", fontSize: "18px" }}>Team 3:</Text>
                    <div style={{ margin: "20px+50px+15px" }}>
                        <ChargeScoring setPoints={setPtsPlyr3} isTele={isItTele} />
                    </div>
                    <Text style={{ margin: "10px+50px", color: "white", fontSize: "20px" }}>Single: {pointPlyr3}</Text>
                </div>

            </div>

            <Text style={{ margin: "10px+50px", color: "white", fontSize: "20px", display: "flex", justifyContent: "center" }}>Team: {pointPlyr1 + pointPlyr2 + pointPlyr3}</Text>
        </>
    );
}