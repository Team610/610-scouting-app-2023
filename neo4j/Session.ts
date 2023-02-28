import neo4j from 'neo4j-driver'

const uri:string = "bolt://localhost:7687"
const driver = neo4j.driver(uri, neo4j.auth.basic("neo4j", "robotics"))

export function getNeoSession(){
    let session = driver.session()
    return session
}