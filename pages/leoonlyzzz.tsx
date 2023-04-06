import { Button } from "@mantine/core";
import { addDummyData } from "../neo4j/AddData";
import { calculateTeamAgg, getAllTeamNumbers, getPiecesPickedUpAllMatches, getPiecesScoredAllMatches, setTeamAgg } from "../neo4j/Aggregate";
import { wipe } from "../neo4j/Miscellaneous";
import sampleMatch from "../data/sampleMatch.json"
import { getNeoSession } from "../neo4j/Session";

export default function rdr() {
    return (
        < div >
            {/* <Button onClick={async () => await addDummyData({ data: sampleMatch })}>
                Add dummy data
           </Button>
    <Button onClick={async () => await wipe()}>Wipe</Button>*/}
            {/* <Button onClick={async () => await boasdfl()}>boff</Button> */}
            {/* <Button onClick={async () => await calculateTeamAgg({team: 2706})}>agg time benchmark</Button> */}
        </div >
    )
}

export async function boasdfl() {
    const teamlist = await getAllTeamNumbers();
    // console.log(teamlist)
    // for (let i = 0; i < teamlist.length; i++) {
    //     await calculateTeamAgg({ team: teamlist[i] });
    //     console.log("calculating " + (i + 1) + "/" + teamlist.length)
    // }
    // await calculateTeamAgg({team: 1334})
}

export async function setAff({ team }: { team: number }) {
    const session = getNeoSession();
    try {
        const tx = session.beginTransaction();
        let autoConesScored = await getPiecesScoredAllMatches(team, "cone", false, tx);
        let autoCubesScored = await getPiecesScoredAllMatches(team, "cube", false, tx);

        let teleopConesScored = await getPiecesScoredAllMatches(team, "cone", true, tx);
        let teleopCubesScored = await getPiecesScoredAllMatches(team, "cube", true, tx);

        let cubesScored = teleopCubesScored + autoCubesScored;
        let conesScored = teleopConesScored + autoConesScored;

        const affinity = (cubesScored) / (conesScored + cubesScored)

        let qs =
            "MERGE (ta:TeamAgg{name:toInteger(" +
            team +
            ")})\nWITH ta\nMATCH (t:Team{name: toInteger(" +
            team +
            ")})\n" +
            "SET ta.cubeCycleProportion = toFloat(" + affinity + ")\n";

        await tx.run(qs);
        await tx.commit();
        await session.close();
    } catch (error) {
        console.log(error);
    }
}