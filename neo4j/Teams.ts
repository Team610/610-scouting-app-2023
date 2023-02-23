import { getNeoSession } from "./Session";

//returns the number of teams
export async function getTeams(){
    const session = getNeoSession()
    const tx = session.beginTransaction()
    try{

        const res = await tx.run('MATCH (n:Team) return (n)')
        return res.records[2].get(0).properties.name

    }catch(e){
        console.log(e)
    }
}