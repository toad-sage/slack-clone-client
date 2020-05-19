import ApolloClient from 'apollo-client'
// import { createHttpLink } from 'apollo-link-http'
import { createUploadLink } from 'apollo-upload-client';
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

import 'semantic-ui-css/semantic.min.css'

const httpLink = createUploadLink({
  uri: 'http://localhost:8080/graphql'
});

const middlewareLink = setContext( () => ({
  headers: {
    'x-token' : localStorage.getItem('token'),
    'x-refresh-token' : localStorage.getItem('refreshToken'),
  }
}))

const afterwareLink = new ApolloLink((operation,forward) => {
  
  return forward(operation).map(response => {
    const { response: {headers} } = operation.getContext();
    if(headers){
      const token = headers.get('x-token');
      const refreshToken = headers.get('x-refresh-token');
  
      if(token){
        localStorage.setItem('token',token);
      }
  
      if(refreshToken){
        localStorage.setItem('refresh-token',refreshToken);
      }
    }
  
    return response;
  })
})

const httpLinkWithMiddleWare = afterwareLink.concat(
  middlewareLink.concat(httpLink)
  );

export const wsLink = new WebSocketLink({
    uri: 'ws://localhost:8080/graphql',
    options: {
      reconnect: true,
      lazy: true,
      connectionParams: () => {
          return {
            token: localStorage.getItem('token'),
            refreshToken: localStorage.getItem('refreshtoken'),
          }
        }
    },
  });  

const link = split (
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      wsLink,
      httpLinkWithMiddleWare,
)

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})

export default client;