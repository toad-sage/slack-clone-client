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
        channels={team.channels}
        isOwner={team.admin}
        onAddChannelClick={this.toggleAddChannelModal}
        onInvitePeopleClick={this.toggleInvitePeopleModal}
        openDirectMessageClick={this.toggleDirectMessageModal}
        users={team.directMessageMembers.filter(member => member.id !== currentUserId)}
      />,
      <DirectMessageModal
        teamId = {team.id}
        open = {openDirectMessageModal}
        key = "sidebar-direct-message-modal"
        onClose= {this.toggleDirectMessageModal}
      />
      ,
      <AddChannelModal
        teamId = {team.id}
        open = {openAddChannelModal}
        key = "sidebar-add-channel-modal"
        onClose= {this.toggleAddChannelModal}
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