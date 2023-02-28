import neo4j from 'neo4j-driver'

const uri:string = "neo4j://159.89.127.45:7687"
const driver = neo4j.driver(uri, neo4j.auth.basic(process.env.DATABASE_NAME!, process.env.DATABASE_PASSWORD!))

export function getNeoSession(){
    let session = driver.session()
    return session
}