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
		this.scroller = React.createRef();
	}
	
	// eslint-disable-next-line react/no-deprecated
	componentDidMount() {
		console.log('channel',this.props.channelId)
		this.unsubscribe = this.subscribe(this.props.channelId);
	}

	// this is subscribe channel whenever channel is changed
	//and channelId is recieved as props
	componentWillReceiveProps({ messages,channelId }) {
		if(this.props.channelId !== channelId){
			if(this.unsubscribe){
				this.unsubscribe();
			}
			this.unsubscribe = this.subscribe(channelId);
		}

		if (
	      this.scroller.current &&
	      this.scroller.current.scrollTop < 20 &&
	      this.props.data.messages &&
	      messages &&
	      this.props.data.messages.length !== messages.length
	    ) {
	      //20 items
	      const heightBeforeRender = this.scroller.current.scrollHeight;
	      // wait for 40 item to render
	      setTimeout(() => {
	        if (this.scroller.current) {
	          this.scroller.current.scrollTop = this.scroller.current.scrollHeight - heightBeforeRender;
	        }
	      }, 200);
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

	handleScroll = () => {
		const { hasMoreItems } = this.state;
		const {data: {messages,fetchMore},channelId} = this.props
		// console.log(this.scroller.current.scrollTop);
		/* 20 is message limit on backend */
		if(this.scroller && this.scroller.current.scrollTop < 100 && hasMoreItems && messages.length >=20){
			fetchMore({
				variables: {
					channelId,
					cursor: messages[messages.length -1].createdAt
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
		}
	}

   render(){
	// eslint-disable-next-line react/prop-types
	const {data: {loading,messages,fetchMore},channelId} = this.props
	return (loading ? null : (
		<Messages 
			onScroll={this.handleScroll}
			ref = {this.scroller}>
		<FileUpload style={{ display: 'flex', flexDirection: 'column-reverse' }} channelId={channelId} disableClick>
				<Comment.Group>
					{messages.slice().reverse().map((m,index) => (
					<Comment key={`${index}-message`}>
						<Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
						<Comment.Content>
						<Comment.Author as='a'>{m.user.username}</Comment.Author>
						<Comment.Metadata>
							<div>{m.createdAt}</div>
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
		},
	})
})(MessageContainer)
