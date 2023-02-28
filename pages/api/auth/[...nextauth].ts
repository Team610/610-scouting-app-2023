import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
// import google from "../../../google-cred.json"

const options = {
    providers: [
        GoogleProvider({
          clientId: process.env.CLIENT_ID as string,
          clientSecret: process.env.CLIENT_SECRET as string
        })
      ]
}

export default NextAuth(options)