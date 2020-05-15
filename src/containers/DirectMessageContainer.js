/* eslint-disable react/prop-types */
import React, { Component } from 'react'

import { Comment } from 'semantic-ui-react'

import Messages from '../components/Messages'
import { graphql } from '@apollo/react-hoc'

import gql from 'graphql-tag'

const directMessagesQuery = gql`
	query($teamId: Int!,$userId: Int!){
		directMessages(teamId: $teamId,otherUserId: $userId){
		id
		text
		sender{
			username
		}
		createdAt
	}
  }
`;

const newDirectMessageSubscription = gql`
  subscription($teamId: Int!, $userId: Int!) {
    newDirectMessage(teamId: $teamId, userId: $userId) {
      id
      sender {
        username
      }
      text
      createdAt
    }
  }
`;

class DirectMessageContainer extends Component {

	componentDidMount() {
		this.unsubscribe = this.subscribe(this.props.teamId,this.props.userId);
	}

	componentWillReceiveProps({ teamId,userId }) {
		if(this.props.teamId !== teamId || this.props.userId !== userId){
			if(this.unsubscribe){
				this.unsubscribe();
			}
			this.unsubscribe = this.subscribe(teamId,userId);
		}
	}

	componentWillUnmount(){
		if(this.unsubscribe){
			this.unsubscribe();
		}
	}

	subscribe = (teamId,userId) => 
		this.props.data.subscribeToMore({
			document: newDirectMessageSubscription,
			variables: {
				teamId: Number(teamId),
				userId: Number(userId)
			},
			updateQuery: (prev,{subscriptionData}) => {
				if(!subscriptionData){
					return prev;
				}
				console.log(prev,subscriptionData);
				return{
					...prev,
					directMessages: [...prev.directMessages, subscriptionData.data.newDirectMessage],
				};
			},
		});

	
	render() {

		const {data: {loading,error,directMessages}} = this.props;

		console.log(this.props);
	
		if(error) {
		return <h1>{error}</h1>
		}

		return (loading ? null : (
			<Messages>
				<Comment.Group>
					{directMessages.map(m => (
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
}

export default graphql(directMessagesQuery,{
	options: props => ({
		variables: {
			teamId: Number(props.teamId),
			userId: Number(props.userId)
		},
		fetchPolicy: 'network-only'
	})
})(DirectMessageContainer);
