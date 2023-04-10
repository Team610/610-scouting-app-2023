import type { NextApiRequest, NextApiResponse } from 'next'
import { getNeoSession } from '../../neo4j/Session'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    
  res.status(200).json({ name: 'John Doe' })
}

export async function getGridData() {
    try {
      const session = getNeoSession()
      const tx = session.beginTransaction()
      const qs = "MATCH (n:Team{name:610}) - [x] - (m:Cycle)\n"
        + "MATCH(m) - [y: SCORED] - (s:ScoringPosition)\n"
        + "RETURN n.name, s.name, TYPE(x), m.substation, m.teleop, y.link, COUNT(*)"
      const ret = await tx.run(qs)
    } catch (error) { console.error(error) }
  }