import React, { Component } from 'react';

import decode from 'jwt-decode';

import Channels from '../components/Channels'
import Teams from '../components/Teams'
import AddChannelModal from '../components/AddChannelModal'
import InvitePeopleModal from '../components/InvitePeopleModal'

class Sidebar extends Component {

  state = {
    openAddChannelModal: false,
    openInvitePeopleModal: false, 
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

  render (){

    const {teams , team} = this.props;
    const { openInvitePeopleModal, openAddChannelModal } = this.state;

    let username = '';
    let isOwner = false;
    try {
      const token = localStorage.getItem('token');
      const { user } = decode(token);
      // eslint-disable-next-line prefer-destructuring
      username = user.username;
      // console.log(team);
      isOwner = user.id === team.owner;
      // console.log(`isOwner`,isOwner);
    } catch (err) {}

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
        isOwner={isOwner}
        onAddChannelClick={this.toggleAddChannelModal}
        onInvitePeopleClick={this.toggleInvitePeopleModal}
        users={[{ id: 1, name: 'slackbot' }, { id: 2, name: 'user1' }]}
      />,
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