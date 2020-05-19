/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import {graphql } from '@apollo/react-hoc'

import { Comment ,Image,Button} from 'semantic-ui-react'

import Messages from '../components/Messages'
import {messageQuery} from '../graphql/message'
import RenderText from '../components/RenderText'
import gql from 'graphql-tag'

import FileUpload from '../components/FileUpload'

const newChannelMessageSubscription = gql`
	subscription($channelId: Int!){
		newChannelMessage(channelId: $channelId){
		id
		text
		url
		fileType
		user{
			username
		}
		createdAt
		}
	}
`;


const Message = ({ message: { url, text, fileType } }) => {
  if (url) {
	console.log(url.trim());
    if (fileType.startsWith('image/')) {
      return (<div>
			  <Image
			    src={url}
			    as='a'
			    size='medium'
			  />
			  </div>
			)
    } else if (fileType === 'text/plain') {
      return <RenderText url={url} />;
    } else if (fileType.startsWith('audio/')) {
      return (
        <div>
          <audio controls>
            <source src={url} type={fileType} />
          </audio>
        </div>
      );
    } else if(fileType.startsWith('video/')){
		return (<div>
					<video width="320" height="240" controls>
		 			 	<source src={url} type={fileType} />
					</video>
				</div>)
    }
  }

  return <Comment.Text >{text}</Comment.Text>;
};


class MessageContainer extends Component { 

	constructor(props){
		super(props);
		this.state = {
			hasMoreItems: true
		}
	}
	
	// eslint-disable-next-line react/no-deprecated
	componentDidMount() {
		console.log('channel',this.props.channelId)
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
				if(!subscriptionData.data){
					return prev;
				}
				let newMessage = subscriptionData.data.newChannelMessage;
				if(!newMessage.url)
				{
					newMessage.url = null;
					newMessage.fileType = null;
				}
				return{
					...prev,
					messages: [newMessage,...prev.messages],
				};
			},
		});

	time = (createdAt) => {
		let date = new Date(createdAt);

		return `${date}`
	} 

   render(){
	// eslint-disable-next-line react/prop-types
	const {data: {loading,messages},channelId} = this.props
	return (loading ? null : (
		<Messages>
		<FileUpload channelId={channelId} disableClick>
				<Comment.Group>
					{this.state.hasMoreItems && (<Button onClick={() => {
											this.props.data.fetchMore({
												variables: {
													channelId,
									            	offset: messages.length
										        },
										        updateQuery: (prev, { fetchMoreResult }) => {
										            if (!fetchMoreResult) return prev;
										            if(fetchMoreResult.messages.length === 0)
										            {
										            	this.setState({hasMoreItems: false})
										            }
										            return {
										            	...prev,
										            	messages: [...prev.messages,...fetchMoreResult.messages],
										            }
										        }
											});
										}}>Load More
										</Button>)}
					{[...messages].reverse().map(m => (
					<Comment key={`${m.id}-message`}>
						<Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
						<Comment.Content>
						<Comment.Author as='a'>{m.user.username}</Comment.Author>
						<Comment.Metadata>
							<div>{this.time(m.createdAt)}</div>
						</Comment.Metadata>
						<Message message={m}/>
						<Comment.Actions>
							<Comment.Action>Reply</Comment.Action>
						</Comment.Actions>
						</Comment.Content>
					</Comment>
					))}				
				</Comment.Group>
		</FileUpload>
		</Messages>

	))
   }
}

export default graphql(messageQuery,{
	options:props => ({
		fetchPolicy: "network-only",
		variables:{
		channelId: props.channelId,
		offset: 0,
		},
	})
})(MessageContainer)
