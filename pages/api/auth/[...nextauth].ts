import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import google from "../../../google-cred.json"

const options = {
    providers: [
        GoogleProvider({
          clientId: google.web.client_id as string,
          clientSecret: google.web.client_secret as string
        })
      ]
}

export default NextAuth(options)