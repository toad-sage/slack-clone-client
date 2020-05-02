/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from 'react';
import Header from '../components/Header';
import SendMessage from '../components/SendMessage';
import AppLayout from '../components/AppLayout';
import Sidebar from '../containers/Sidebar'
import DirectMessageContainer  from '../containers/DirectMessageContainer'

import findIndex from 'lodash/findIndex'
import {flowRight as compose} from 'lodash';

import {Redirect} from 'react-router-dom'
import { graphql } from '@apollo/react-hoc'
import { meQuery } from '../graphql/team'
import gql from 'graphql-tag';

const createDirectMessageMutation = gql`
    mutation($receiverId: Int!,$text: String!,$teamId: Int!){
        createDirectMessage(receiverId: $receiverId,text: $text,teamId: $teamId)
    }
`;

const ViewTeam  = ({ mutate,data: { loading, me }, match: { params: { teamId , userId } } }) => {

    if (loading) {
      return null;
    }

    // console.log(otherProps);
    console.log(me);

    const { teams,username } = me;

    if(!teams.length){
        return (<Redirect to="/createTeam"/>)
    }

    // console.log(inviteTeams);

    let teamIdx = teamId ? findIndex(teams, ['id', Number(teamId)]) : 0;
    if(teamIdx === -1){
        teamIdx = 0; 
    }
    const team = teams[teamIdx];

    return (
        <AppLayout>
            <Sidebar 
                teams={teams.map(t => ({
                  id: t.id,
                  letter: t.name.charAt(0).toUpperCase(),
                }))}
                username={username}
                team={team}
             />
            <Header channelName="Someone's username" />
            {console.log(`details: ${teamId} ${userId}`)}
            <DirectMessageContainer teamId={teamId} userId={userId} />
            <SendMessage 
                placeholder={userId} 
                onSubmit={
                    async(text) => {
                        const response = await mutate({
                            variables: {
                                text,
                                receiverId: Number(userId),
                                teamId: Number(teamId)
                            },
                        });
                        console.log(response);
                    }
                }  
            />
        </AppLayout>
    )
}

export default compose(
    graphql(meQuery,{options: { fetchPolicy: 'network-only' }}),
    graphql(createDirectMessageMutation),
)(ViewTeam); 