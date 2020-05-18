import React, { Component } from 'react';

import Channels from '../components/Channels'
import Teams from '../components/Teams'
import AddChannelModal from '../components/AddChannelModal'
import InvitePeopleModal from '../components/InvitePeopleModal'
import DirectMessageModal from '../components/DirectMessageModal'

class Sidebar extends Component {

  state = {
    openAddChannelModal: false,
    openInvitePeopleModal: false, 
    openDirectMessageModal: false,
  }

  toggleAddChannelModal = (e) => {
    if(e){
      e.preventDefault();
    }
    this.setState(state => ({ openAddChannelModal: !state.openAddChannelModal }));
  }

  toggleInvitePeopleModal = (e) => {
      if(e){
        e.preventDefault();
      }
     this.setState(prevState =>({ openInvitePeopleModal: !prevState.openInvitePeopleModal }))
  }

  toggleDirectMessageModal = (e) => {
    if(e){
      e.preventDefault();
    }
   this.setState(prevState =>({ openDirectMessageModal: !prevState.openDirectMessageModal }))
  }

  render (){

    const {teams , team,username,currentUserId} = this.props;
    // console.log(team.directMessageMembers,currentUserId)
    const { openInvitePeopleModal, openAddChannelModal,openDirectMessageModal } = this.state;

    const regularChannels = [];
    const dmChannels = [];

    team.channels.forEach(t => {
      if(t.dm){
        dmChannels.push(t);
      }else{
        regularChannels.push(t);
      }
    })


    return [
      <Teams
        key="team-sidebar"
        teams={teams}
      />,  
      <Channels
        key="channels-sidebar"
        teamName={team.name}
        username={username}
        teamId = {team.id}
        channels={regularChannels}
        isOwner={team.admin}
        onAddChannelClick={this.toggleAddChannelModal}
        onInvitePeopleClick={this.toggleInvitePeopleModal}
        openDirectMessageClick={this.toggleDirectMessageModal}
        dmChannels={dmChannels}
      />,
      <DirectMessageModal
        teamId = {team.id}
        open = {openDirectMessageModal}
        key = "sidebar-direct-message-modal"
        onClose= {this.toggleDirectMessageModal}
        currentUserId={currentUserId}
      />
      ,
      <AddChannelModal
        teamId = {team.id}
        open = {openAddChannelModal}
        key = "sidebar-add-channel-modal"
        onClose= {this.toggleAddChannelModal}
        currentUserId= {currentUserId}
      />,
      <InvitePeopleModal
        teamId = {team.id}
        open = {openInvitePeopleModal}
        onClose = {this.toggleInvitePeopleModal}
        key = "side-bar-invite-people-modal"
      />
    ];
  }
}

export default Sidebar; 