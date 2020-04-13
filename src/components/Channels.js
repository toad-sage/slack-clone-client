/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from 'react'
import styled from 'styled-components';

const ChannelWrapper = styled.div`
  grid-column: 2;
  grid-row: 1 / 4;
  background-color: #4e3a4c;
  color: #958993;
`;

const TeamNameHeader = styled.h1`
  color: #fff;
  font-size: 20px;
`;

const paddingLeft = 'padding-left: 10px';

const PushLeft = styled.div`${paddingLeft}`

const SideBarList = styled.ul`
  width: 100%;
  list-style: none;
  padding-left: 0px;
`;

const SideBarListHeader = styled.li`${paddingLeft}`

const SideBarListItem = styled.li`
  padding: 2px;
  ${paddingLeft};
  &:hover {
    background: #3e313c;
  }
`;

const Green  = styled.span`
  color: #38978d;
`;

const Button  = ({on = true}) => (on ? <Green>●</Green> : 'o');

const channel = ({id,name}) => <SideBarListItem key={`channel-${id}`}># {name}</SideBarListItem>;

const user = ( {id , name} ) => <SideBarListItem key={`user-${id}`}>
                                  <Button on={false}/>{name}
                                </SideBarListItem>;

export default ({teamName,username,channels,users}) => (
  <ChannelWrapper>
    <div>
      <PushLeft>
        <TeamNameHeader>{teamName}</TeamNameHeader>
        {username}
      </PushLeft>
    </div>
    <div>
      <SideBarList>
        <SideBarListHeader>Channels</SideBarListHeader>
        {channels.map(channel)}
      </SideBarList>
    </div>
    <div>
      <SideBarList>
        <SideBarListHeader>Direct Messages</SideBarListHeader>
        {users.map(user)}
      </SideBarList>
    </div>
  </ChannelWrapper>
)