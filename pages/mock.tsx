import React, { useState } from 'react'
import { Button, Table, TextInput } from "@mantine/core";

export default function Mock() {
    // [top scored, mid scored, bottom scored]
    const [teams, setTeams] = useState<number[]>([0, 0, 0, 0, 0, 0])
    const options = [["AUTO-TOP", 6], ["AUTO-MID", 4], ["AUTO-BOTTOM", 3], ["TELEOP-TOP", 5], ["TELEOP-MID", 3], ["TELEOP-BOTTOM", 2], ["LINKS", 5]]
    const roles = ["Blue 1", "Blue 2", "Blue 3", "Red 1", "Red 2", "Red 3"]
    const entry = options.map(([op, weight]: [string, number]) => (
        <TextInput
            label={op}
            defaultValue={0} // todo: change
            // onChange={(e: any) => handleWeightChange(feature, e.currentTarget.value)}
            maxLength={3}
        ></TextInput>
    ))

    const display = teams.map((team: number) => (
        <div>
            <h1>{team}</h1>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "10px",
                }}
            >
                <>{entry}</>
            </div>
        </div>
    ))

    return (
        <div>{display}</div>
    )
}
