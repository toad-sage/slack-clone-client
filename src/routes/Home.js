import React from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

const allUsersQuery = gql `
    {
        allUsers {
            id
            email
        }
    }
`;

const Home = () => {

    
    const { loading,error,data } = useQuery(allUsersQuery);

    if(loading) return <p>Loading...</p>
    if(error) return <p>Error :( {console.log(error)}</p>

    return (
        <div>
            {
                data.allUsers.map(user => {
                   return (<h1 key={user.id}>{user.email}</h1>)
                    }
                )
            }
        </div>
    )
}

export default Home