/* eslint-disable react/prop-types */
import React from 'react'
import { withFormik } from 'formik';
import { Button,Form, Input , Modal } from 'semantic-ui-react'

import gql from 'graphql-tag'
import {graphql } from '@apollo/react-hoc'

import {flowRight as compose} from 'lodash';
import normalizeErrors from '../normalizeErrors';

const InvitePeopleModal = ({
  open , 
  onClose,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  touched,
  errors,
  isSubmitting
}) => (
  <Modal open= {open} onClose={onClose}>
    <Modal.Header>Add Member</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input 
            values={values.name}
            name="email"
            onChange={handleChange}
            onBlur={handleBlur}
            fluid
            placeholder="User's email"
          />
        </Form.Field>
        {touched.email && errors.email ? errors.email[0] : null}
        <Form.Group widths="equal">
            <Button fluid disabled={isSubmitting} onClick={onClose}>Cancel</Button>
            <Button fluid disabled={isSubmitting} onClick={handleSubmit}>Add User</Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
)

const addTeamMemberMutation = gql`
	mutation($email: String! , $teamId: Int!){
		addTeamMember(email: $email,teamId: $teamId){
			ok
			errors{
				path
				message
			}
		}
	}
`;

export default compose( 
  graphql(addTeamMemberMutation),
  withFormik({
  mapPropsToValues: () => ({email: ''}),
  handleSubmit: async (values,
      { props: {teamId , onClose , mutate}, 
      setSubmitting , setErrors }) => {
      console.log(teamId);
      const response = await mutate({
        variables: {teamId,email: values.email}
      });
	
	const {ok , errors } = response.data.addTeamMember;
	if(ok){
		onClose();
		setSubmitting(false);
	}
	else{
		setSubmitting(false);
		setErrors(normalizeErrors(errors.map(e => (
      e.message === "user_id must be unique" ?
      {
        path: "email",
        message: "This user is already part of the team"
      }: e
      ) )));
	}
  },
}),
)(InvitePeopleModal);