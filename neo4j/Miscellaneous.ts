import Head from "next/head";
import { Session } from "next-auth";
import { getNeoSession } from "./Session";
import neo4j from 'neo4j-driver'

const uri = "bolt://localhost:7687"
const driver = neo4j.driver(uri, neo4j.auth.basic("neo4j", "robotics"))

//takes a string as a parameter that will be executed as a querry in neo4j
export async function query(qt: string){
  const session = getNeoSession()
  const tx = session.beginTransaction()

  try{
    const result = await tx.run(qt)
    console.log(result)
  } catch (error) {
    console.error(error)
  }
  await tx.commit()
  
}

// wipes database
export async function wipe(){
  const session = getNeoSession()
  const tx = session.beginTransaction()

  try{
    const result = await tx.run("MATCH (n) DETACH DELETE n")
  } catch (error) {
    console.error(error)
  }
  await tx.commit()
  
}