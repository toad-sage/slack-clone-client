import gql from 'graphql-tag'

export const messageQuery = gql`
	query($cursor: String,$channelId: Int!){
		messages(cursor: $cursor,channelId: $channelId){
			id
			text
			fileType
			url
			user{
				username
			}
			createdAt
		}
	}
`;