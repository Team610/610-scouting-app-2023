import { useState } from "react"

const matchStats = [
    {value: 'autoCycles', label: 'Auto Cycles'},
    {value: 'autoPiecesScored', label: 'Auto Top'},
    {value: 'autoPiecesScored', label: 'Auto Middle'},
    {value: 'teleopCycles', label: 'Teleop Cycles'},
    {value: 'teleopPiecesScored', label: "Teleop Scored"},
    {value: 'autoClimbPoints', label: 'Auto Climb Points'},
    {value: 'teleopClimbPoints', label: 'Teleop Climb Points'}
]

export default function StatSelector(){
    //used for matches and stats
    const [stats, setStats] = useState()
    return(
        <></>
    )
}