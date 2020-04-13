import React from 'react'
import styled from 'styled-components';
import { Input } from 'semantic-ui-react'

const InputWrapper =  styled.div`
  grid-column: 3;
  grid-row: 3;
`;

export default ({channelName}) => (
	<InputWrapper>
		<Input fluid placeholder={`Message #${channelName}`}/>
	</InputWrapper>
)