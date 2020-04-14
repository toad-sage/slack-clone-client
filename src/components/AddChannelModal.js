import React from 'react'
import { withFormik } from 'formik';
import { Button,Form, Input , Modal } from 'semantic-ui-react'

import gql from 'graphql-tag'
import {graphql } from '@apollo/react-hoc'

import {flowRight as compose} from 'lodash';
import findIndex from 'lodash/findIndex';
import {allTeamsQuery} from '../graphql/team'

const AddChannelModel = ({
  teamId,
  open , 
  onClose,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting
}) => (
  <Modal open= {open} onClose={onClose}>
    <Modal.Header>Add Channel</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input 
            values={values.name}
            name="name"
            onChange={handleChange}
            onBlur={handleBlur}
            fluid
            placeholder="Channel Name"
          />
        </Form.Field>
        <Form.Group widths="equal">
            <Button fluid disabled={isSubmitting} onClick={onClose}>Cancel</Button>
            <Button fluid disabled={isSubmitting} onClick={handleSubmit}>Create Channel </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
)

const createChannelMutation = gql`
  mutation($teamId: Int!, $name: String!){
    createChannel(teamId: $teamId,name: $name){
      channel{
        id
        name
      }
      ok
    }
  }
`;

export default compose( 
  graphql(createChannelMutation),
  withFormik({
  mapPropsToValues: () => ({name: ''}),
  handleSubmit: async (values,{ props: {teamId , onClose , mutate}, setSubmitting }) => {
    await mutate(
      {variables: {teamId,name: values.name},
      optimisticResponse: {
        createChannel: {
          __typename: 'Mutation',
          ok: true,
          channel: {
            __typename: 'Channel',
            id: -1,
            name: values.name
          },
        },
      },
      update: (store, { data: {createChannel}}) => {
        const {ok , channel} = createChannel;
        if(!ok){
          return;
        }
        const data = store.readQuery({ query: allTeamsQuery });
        const teamIdx = findIndex(data.allTeams, ['id', teamId]);
        data.allTeams[teamIdx].channels.push(channel);
        store.writeQuery({ query: allTeamsQuery, data });
      }, 
    });
    onClose();
    setSubmitting(false);
  },
}),
)(AddChannelModel);