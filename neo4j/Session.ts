import neo4j from 'neo4j-driver'

const uri:string = process.env.NEXT_PUBLIC_DATABASE_URI!
const driver = neo4j.driver(uri, neo4j.auth.basic("neo4j", process.env.NEXT_PUBLIC_DATABASE_PASSWORD!))

export function getNeoSession(){
    let session = driver.session({ database: "northbay" })
    return session
}