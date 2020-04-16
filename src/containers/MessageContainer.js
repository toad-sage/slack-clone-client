import React from 'react'
import {graphql } from '@apollo/react-hoc'

import { Comment } from 'semantic-ui-react'

import Messages from '../components/Messages'
import {messageQuery} from '../graphql/message'

const MessageContainer = ({data: {loading,messages}}) => 
	(loading ? null : (
		<Messages>
		{console.log(messages)}
			<Comment.Group>
				{messages.map(m => (
					<Comment key={`${m.id}-message`}>
				      <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
				      <Comment.Content>
				        <Comment.Author as='a'>{m.user.username}</Comment.Author>
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

export default graphql(messageQuery,{
	variables: props => ({
		channelId: props.channelId,
	})
}
)(MessageContainer)
