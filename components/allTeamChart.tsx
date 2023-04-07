import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Chart,
} from 'chart.js';
import { Scatter, Bubble } from 'react-chartjs-2';
import { teamAggData } from '../utils';
import { getAllTeamData, getCompTeams } from '../neo4j/Aggregate';
import { Anchor, NativeSelect, Select, Text } from '@mantine/core';
import { isContext } from 'vm';
import { Point } from 'neo4j-driver';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { number } from 'prop-types';

ChartJS.register(LinearScale, PointElement, Tooltip, ChartDataLabels);
export let plugins = [ChartDataLabels];

//options for scatter chart (changes to what data the user wants to look at)
export let options = {
    plugins: {
        tooltip: {
            callbacks: {
                label: (context: any) => {
                    return `Team: ${context.raw.num} (${context.raw.x}, ${context.raw.y})`
                }
            }
        },
        datalabels: {
            display: "auto",
            color: "black",
            align: "top",
            anchor: 'end',
            labels: {
                title: {
                    font: {
                        weight: 'bold'
                    }
                }
            },
            formatter: function(value, context) {
                return value.num;
            }
        },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'autoPPG',
                min: 50,
                max: 100,
            }
        },
        y: {
            title: {
                display: true,
                text: 'autoPPG',
            },
            
        },
        
    },
    
}

//default optons in general (used to reset the scatter chart)
export let defaultOptions = {
    plugins: {
        tooltip: {
            callbacks: {
                label: (context: any) => {
                    return `Team: ${context.raw.data} (${context.raw.x}, ${context.raw.y})`
                }
            }
        }
    },
    scales: {
        x: {
            title: {
                display: true,
                text: '',
            }
        },
        y: {
            title: {
                display: true,
                text: '',
            }
        },
    },
}

//holds data for teams (data here is default and is arbitrary)
export const data = {
    datasets: [
        {
            data: [{
                x: -16,
                y: 4,
                r: 20,
                num: 610,
            }, {
                x: 32,
                y: 4.3,
                r: 20,
                num: 564
            }, {
                x: 5.6,
                y: 5.6,
                r: 20,
                num: 453
            }, {
                x: 5.7,
                y: 5.6,
                r: 20,
                num: 222
            }],
            backgroundColor: 'rgba(255, 99, 132, 1)',
        },
    ],
};

//Mantine componenet to select aggregate data for an axis
function SelectAxis({ setAxis }: { setAxis: Function }) {

    return <NativeSelect

        onChange={(event) =>
            setAxis(event.currentTarget.value)
        }
        size="xs"
        data={["autoNoClimb", "teleopPPG", "cyclesPG", "climbPPG", "avgPiecesScored", "maxPiecesScored", "scoringAccuracy", "weightedCyclesPG", "linkPG"]}
    />
}

//sets the axis labels to the piece of aggregate data selected for x and y axis
function setAxisLabel({ xAxis, yAxis }: { xAxis: string, yAxis: string }) {
    if(xAxis == '') options.scales.x.title.text = 'autoNoClimb' 
    else options.scales.x.title.text = xAxis
    if(yAxis = '') options.scales.y.title.text = 'autoNoClimb'
    else options.scales.y.title.text = yAxis
}

//sets points of the scatter chart to the aggreagate data of the x and y axis
function setData({ teams, xAxis, yAxis }: { teams: teamAggData[], xAxis: string, yAxis: string }) {
    console.log(teams)
    console.log(xAxis + " " + yAxis);
    //does this for every team
    data.datasets = [{
        data: Array.from(teams, (team) => ({
            x: xAxis != '' ? team[xAxis] as number : team.autoNoClimb,
            y: yAxis != '' ? team[yAxis] as number : team.autoNoClimb,
            r: 10, 
            num: team.team,
        })),
        
        backgroundColor: 'rgba(255, 99, 132, 1)',
    }]
}


//main function
export function AllTeamChart() {
    const [teams, setTeams] = useState<teamAggData[]>();
    const [xAxis, setXAxis] = useState('');
    const [yAxis, setYAxis] = useState('');
    const [draw, setDraw] = useState(true);

    //gets team data
    useEffect(() => {
        async function getData() {
            console.log("getting data");
            setTeams(await getAllTeamData());
        }
        getData();
    }, []);

    //sets "draw" to true after its been turned false (chart reappears)
    useEffect(() => {
        setDraw(true)
    }, [draw])

    //happens when x or y axis changes
    useEffect(() => {
        
        //sets axis label
        setAxisLabel({ xAxis: xAxis, yAxis: yAxis })
        //if teams are loaded, sets the points on the scatter chart
        if (teams != undefined) {
            setData({ teams, xAxis, yAxis });
        }

        //reloads the chart by setting "draw" to false (chart dissapears)
        setDraw(false)
    }, [xAxis, yAxis, teams]);


    return <>

        <div style={{ backgroundColor: "white" }}>
            {teams != undefined ?
                (<><div style={{display: "flex", flexDirection: "column", gap: "15px"}}><div><Text style={{ color: "black", fontSize: "15px" }}>XAxis:</Text>
                    <SelectAxis setAxis={setXAxis} />

                    <Text style={{ color: "black", fontSize: "15px" }}>YAxis:</Text>
                    <SelectAxis setAxis={setYAxis} /></div>
                    {draw ? <Bubble options={options} data={data} plugins={plugins} /> : <Bubble options={defaultOptions} data={data} plugins={plugins} />}</div>

                </>) :
                <Text>Loading</Text>}
        </div>

    </>

}
