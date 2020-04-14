import React, { Component } from 'react';
import { graphql } from '@apollo/react-hoc'

import findIndex from 'lodash/findIndex';
import decode from 'jwt-decode';

import Channels from '../components/Channels'
import Teams from '../components/Teams'
import AddChannelModal from '../components/AddChannelModal'
import {allTeamsQuery} from '../graphql/team'

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

    let { data: { loading, allTeams }, currentTeamId } = this.props;

    currentTeamId = Number(currentTeamId);
    if (loading) {
      return null;
    }

    const teamIdx = currentTeamId ? findIndex(allTeams, ['id', currentTeamId]) : 0;
    const team = allTeams[teamIdx];

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
        teams={allTeams.map(t => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase(),
        }))}
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

export default graphql(allTeamsQuery)(Sidebar);