import gql from 'graphql-tag'

export const messageQuery = gql`
	query($offset: Int!,$channelId: Int!){
		messages(offset: $offset,channelId: $channelId){
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