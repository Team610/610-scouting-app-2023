import Head from "next/head";
import { Session } from "next-auth";
import { getNeoSession } from "./Session";
import neo4j from 'neo4j-driver'

const uri = "bolt://localhost:7687"
const driver = neo4j.driver(uri, neo4j.auth.basic("neo4j", "robotics"))


export async function query(qt: string){
  const session = getNeoSession()
  const tx = session.beginTransaction()

  try{
    const result = await tx.run(qt)
    console.log(result)
  } catch (error) {
    console.error(error)
  }
  await tx.close()
}