import { useState } from 'react';
import { Checkbox, getSortedBreakpoints, Switch } from '@mantine/core';
import { Text } from '@mantine/core';
import { NativeSelect } from '@mantine/core';

//returns a switch so the user can choose if match is in auto or tele
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


//returns checkboxes so the user can see if the robot is docked or engaged
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


//returns a drop down menu so the user can choose how many users are docked or engaged (only useful during teleOP)
function NumPartners({ soloPoints, setTeamPoints }: { soloPoints: number, setTeamPoints: Function }) {
   //variable used to track number of partners due to a drop down
   const [value, setValue] = useState('');
   //more partners docked/engaged = more points, multiply by num of partners docked/engaged
   setTeamPoints(soloPoints * parseInt(value));
   return (
       <>
           <div style={{ display: "flex", flexDirection: "row", gap: "10px", alignItems: "center" }}> 
               <Text style={{ color: "white", fontSize: "15px", fontFamily: "arial" }} ># of Alliance Members are Docked/Engaged?</Text>
               <NativeSelect
                   value={value}
                   onChange={(event) => setValue(event.currentTarget.value)}
                   data={["1", "2", "3"]}
               />
           </div>


       </>
   );
}


export default function ChargeStation() {
   //sees if the match is in tele
   const [isItTele, setMatchState] = useState(false);
   //tracks points for each teams/players from 1-3
   const [soloPoints, setSoloPoints] = useState(0);
   const [teamPoints, setTeamPoints] = useState(0);


  

   return (
       <>
           <div style={{ margin: "30px+50px", display: "flex", justifyContent: "center" }}>
               <AutoOuTele setMatchState={setMatchState} />
           </div>


           <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
               <Text style={{ margin: "20px+50px+15px", fontSize: "18px" }}>Team You're Scouting:</Text>
               <div style={{ margin: "20px+50px+15px" }}>
                   <ChargeScoring setPoints={setSoloPoints} isTele={isItTele} />
               </div>
               <Text style={{ margin: "10px+50px", color: "white", fontSize: "20px" }}>Single: {soloPoints}</Text>


               <div style={{ display: "flex", margin: "20px+50px+15px" }}>
                   <NumPartners soloPoints={soloPoints} setTeamPoints={setTeamPoints} />
               </div>
           </div>


           <Text style={{ margin: "10px+50px", color: "white", fontSize: "20px", display: "flex", justifyContent: "center" }}>Team: {teamPoints ? teamPoints : soloPoints}</Text>
       </>
   );
}
