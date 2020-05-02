/* eslint-disable react/prop-types */
import React from 'react'
import { useQuery } from '@apollo/react-hooks';

import { Comment } from 'semantic-ui-react'

import Messages from '../components/Messages'
import gql from 'graphql-tag'

const directMessagesQuery = gql`
	query{
		directMessages(teamId: 1,otherUserId: 3){
		id
		text
		sender{
			username
		}
		createdAt
	}
  }
`;

const DirectMessageContainer = ({teamId,userId}) => {
	const {loading,error,data} = useQuery(directMessagesQuery,{
		variables: {
			teamId: teamId,
			userId: userId
		}
	})

	if(error) {
		return <h1>{error}</h1>
	}

	return (loading ? null : (
	<Messages>
		<Comment.Group>
			{data.directMessages.map(m => (
			<Comment key={`${m.id}-message`}>
				<Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
				<Comment.Content>
				<Comment.Author as='a'>{m.sender.username}</Comment.Author>
				<Comment.Metadata>
					<div>{m.createdAt}</div>
				</Comment.Metadata>
				<Comment.Text>{m.text}</Comment.Text>
				<Comment.Actions>
					<Comment.Action>Reply</Comment.Action>
				</Comment.Actions>
				</Comment.Content>
			</Comment>
			))}				
		</Comment.Group>
	</Messages>
	))
}

export default DirectMessageContainer;
