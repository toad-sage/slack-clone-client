/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import React from 'react'
import { Button,Form , Modal } from 'semantic-ui-react'

import {flowRight as compose} from 'lodash';
import findIndex from 'lodash/findIndex';
import { withFormik } from 'formik';

import gql from 'graphql-tag';
import {graphql } from '@apollo/react-hoc'

import {meQuery} from '../graphql/team'
import MultiSelectUsers from './MultiSelectUsers'
import { withRouter } from 'react-router-dom'

const DirectMessageModal = ({
  open , 
  onClose,
  teamId,
  currentUserId,  
  values,
  handleChange,
  handleSubmit,
  isSubmitting,
  setFieldValue,
  resetForm,
}) => (
  <Modal open= {open} onClose={onClose}>
    <Modal.Header>Add Channel</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
        <MultiSelectUsers
              value={values.members}
              handleChange={(e,{value}) => setFieldValue('members',value)}
              teamId={teamId}
              placeholder="Select members to message"
              currentUserId = {currentUserId}
            />
        </Form.Field>
        <Form.Group>
            <Button disabled={isSubmitting} fluid onClick={(e) => {
                resetForm();
                onClose(e)
            }}>
            Cancel
            </Button>
            <Button disabled={isSubmitting} fluid onClick={handleSubmit}>
            Start Messaging
            </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
)

const getDMChannelQuery = gql`
mutation($teamId:Int!,$members: [Int!]!){
  getDMChannel(teamId:$teamId,members: $members){
    id 
    name
  }
}
`;

export default compose(
    withRouter,
    graphql(getDMChannelQuery),
    withFormik({
  mapPropsToValues: () => ({members: []}),
  handleSubmit: async (values,{ props: {onClose , mutate,teamId}, setSubmitting }) => {
    const response = await mutate({
        variables: {
            teamId,
            members: values.members
        },
        update: (store, { data: {getDMChannel}}) => {
        const {id , name} = getDMChannel;
        const data = store.readQuery({ query: meQuery });
        const teamIdx = findIndex(data.me.teams, ['id', teamId]);
        const isChannelPresent = data.me.teams[teamIdx].channels.every(c => c.id !== id);
        if(isChannelPresent){
          data.me.teams[teamIdx].channels.push({id , name , dm: true, __typename: "Channel"});
          store.writeQuery({ query: meQuery, data });
        }
      }, 
    });
    onClose();
    setSubmitting(false);
  },
}))(DirectMessageModal);