/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from 'react';
import Header from '../components/Header';
import SendMessage from '../components/SendMessage';
import AppLayout from '../components/AppLayout';
import Sidebar from '../containers/Sidebar'
import MessageContainer from '../containers/MessageContainer'

import findIndex from 'lodash/findIndex'
import {flowRight as compose} from 'lodash';

import {Redirect} from 'react-router-dom'
import { graphql } from '@apollo/react-hoc'
import { meQuery } from '../graphql/team'
import gql from 'graphql-tag';

const ViewTeam  = ({ mutate,data: { loading, me }, match: { params: { teamId , channelId } } }) => {

    if (loading) {
      return null;
    }

    // console.log(otherProps);
    console.log(me);

    const { teams,username,id } = me;

    if(!teams.length){
        return (<Redirect to="/createTeam"/>)
    }

    // console.log(inviteTeams);

    let teamIdx = teamId ? findIndex(teams, ['id', Number(teamId)]) : 0;
    if(teamIdx === -1){
        teamIdx = 0; 
    }
    const team = teams[teamIdx];
    let channelIdx = channelId ? findIndex(team.channels, ['id', Number(channelId)]) : 0;
    if(channelIdx === -1){
        channelIdx = 0;
    }
    const channel = team.channels[channelIdx];

    return (
        <AppLayout>
            <Sidebar 
                teams={teams.map(t => ({
                  id: t.id,
                  letter: t.name.charAt(0).toUpperCase(),
                }))}
                username={username}
                currentUserId = {id}
                team={team}
             />
            {channel && <Header channelName={channel.name} />}
            {channel && <MessageContainer channelId={channel.id} currentUserId={id} />}
            {channel && <SendMessage 
                channelId={channel.id}
                placeholder={channel.name} 
                onSubmit={
                    async(text) => {
                        await mutate({
                            variables: {text,channelId: channel.id}
                        });
                    }
                }                
                />}
        </AppLayout>
    )
}

const createMessageMutation = gql`
  mutation($channelId: Int!, $text: String!) {
    createMessage(channelId: $channelId, text: $text)
  }
`;

export default compose(
    graphql(meQuery,{options: { fetchPolicy: 'network-only' }}),
    graphql(createMessageMutation),
)(ViewTeam); 