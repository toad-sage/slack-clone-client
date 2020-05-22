import React, { useCallback } from "react";
import Dropzone from 'react-dropzone';
import {graphql } from '@apollo/react-hoc'
import gql from 'graphql-tag'

// eslint-disable-next-line react/prop-types
const FileUpload = ({children,disableClick,mutate,channelId,style}) => {

  const onDrop = useCallback(
    async([file]) => {
     console.log(file); 
     await mutate({
      variables: {
        channelId,
        file
      }
     })
    }
  );


  return(<Dropzone 
      onDrop={onDrop}
      noClick={disableClick}
    >
      {({getRootProps, getInputProps}) => (
        <div {...getRootProps({
          style
        })}>
          <input {...getInputProps()} />
          {children}
        </div>
      )}
    </Dropzone>)
}

const createFileMessageMutation = gql`
  mutation($channelId: Int!,$file: Upload!){
    createMessage(channelId: $channelId,file:$file)
  }
`;

export default graphql(createFileMessageMutation)(FileUpload);