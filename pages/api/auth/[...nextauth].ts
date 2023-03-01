import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";

const options = {
    providers: [
        GoogleProvider({
          clientId: process.env.NEXT_PUBLIC_CLIENT_ID as string,
          clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET as string
        })
      ]
}

export default NextAuth(options)