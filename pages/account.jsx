import React from 'react'
import { useSession, signOut } from 'next-auth/react'

const account = () => {

    if (session) {
        return (
            
            <div>account</div>
        )
    }
}

export default account