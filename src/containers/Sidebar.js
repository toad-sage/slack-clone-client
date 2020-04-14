import React, { Component } from 'react';

import decode from 'jwt-decode';

import Channels from '../components/Channels'
import Teams from '../components/Teams'
import AddChannelModal from '../components/AddChannelModal'

class Sidebar extends Component {

  state = {
    openAddChannelModal: false,
  }

  handleCloseAddChannelModal = () => {
    this.setState({ openAddChannelModal: false })
  }

  handleAddChannelModal = () => {
    this.setState({ openAddChannelModal: true })
  }

  render (){

    const {teams , team} = this.props;

    let username = '';
    try {
      const token = localStorage.getItem('token');
      const { user } = decode(token);
      // eslint-disable-next-line prefer-destructuring
      username = user.username;
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
        onAddChannelClick={this.handleAddChannelModal}
        users={[{ id: 1, name: 'slackbot' }, { id: 2, name: 'user1' }]}
      />,
      <AddChannelModal
        teamId = {team.id}
        open = {this.state.openAddChannelModal}
        key = "sidebar-add-channel-modal"
        onClose= {this.handleCloseAddChannelModal}
      />
    ];
  }
}

export default Sidebar;