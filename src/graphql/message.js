import gql from 'graphql-tag'

export const messageQuery = gql`
	query($channelId: Int!){
		messages(channelId: $channelId){
			id
			text
			user{
				username
			}
			createdAt
		}
	}
`;