/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import {graphql } from '@apollo/react-hoc'

import { Comment } from 'semantic-ui-react'

import Messages from '../components/Messages'
import {messageQuery} from '../graphql/message'
import gql from 'graphql-tag'

const newChannelMessageSubscription = gql`
	subscription($channelId: Int!){
		newChannelMessage(channelId: $channelId){
		id
		text
		user{
			username
		}
		createdAt
		}
	}
`;

class MessageContainer extends Component { 

	// eslint-disable-next-line react/no-deprecated
	componentDidMount() {
		console.log('adsfj',this.props.channelId)
		this.unsubscribe = this.subscribe(this.props.channelId);
	}

	// this is subscribe channel whenever channel is changed
	//and channelId is recieved as props
	componentWillReceiveProps({ channelId }) {
		if(this.props.channelId !== channelId){
			if(this.unsubscribe){
				this.unsubscribe();
			}
			this.unsubscribe = this.subscribe(channelId);
		}
	}

	componentWillUnmount(){
		if(this.unsubscribe){
			this.unsubscribe();
		}
	}

	subscribe = (channelId) => 
		this.props.data.subscribeToMore({
			document: newChannelMessageSubscription,
			variables: {
				channelId,
			},
			updateQuery: (prev,{subscriptionData}) => {
				if(!subscriptionData){
					return prev;
				}
				console.log(prev,subscriptionData);
				return{
					...prev,
					messages: [...prev.messages, subscriptionData.data.newChannelMessage],
				};
			},
		});

   render(){
	// eslint-disable-next-line react/prop-types
	const {data: {loading,messages}} = this.props
	return (loading ? null : (
		<Messages>
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
   }
}

export default graphql(messageQuery,{
	variables: props => ({
		channelId: props.channelId,
	}),
	options:{
		fetchPolicy: "network-only"
	}
}
)(MessageContainer)
