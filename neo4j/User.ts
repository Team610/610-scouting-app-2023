import { Session } from "next-auth";
import { getNeoSession } from "./Session";

export async function addUser(user: Session){
    const session = getNeoSession()
    const tx = session.beginTransaction()
    try {
        const result = await tx.run(
          'MATCH (a:User{ name: $name, email: $email}) RETURN a',
          { name: user.user?.name, email: user.user?.email },
        )

        if(result.records[0] == undefined){
            if(user.user?.email?.includes("@crescentschool.org")){
                const result = await tx.run(
                    'MERGE (a:User{ name: $name, email: $email}) RETURN a',
                    { name: user.user?.name, email: user.user?.email },
                  )
            }
            else{
              return false
            }
        }

        await tx.commit()
        await tx.close()

        return true
  
      } catch (error) {
        console.error(error)
      }
}