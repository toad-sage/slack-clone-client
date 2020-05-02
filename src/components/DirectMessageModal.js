/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import React from 'react'
import { Button,Form, Input , Modal } from 'semantic-ui-react'

import Downshift from 'downshift'

import gql from 'graphql-tag'
import {graphql } from '@apollo/react-hoc'

import { withRouter } from 'react-router-dom'

const DirectMessageModal = ({
  open , 
  onClose,
	teamId,
	history,
	data: {loading,getTeamMembers},
}) => (
  <Modal open= {open} onClose={onClose}>
    <Modal.Header>Add Channel</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
        {!loading && (<Downshift
        onChange={selectedUser => {
					history.push(`/view-team/user/${teamId}/${selectedUser.id}`);
				}}
        itemToString={item => (item ? item.value : '')}
            >
            {({
            getInputProps,
            getItemProps,
            getMenuProps,
            isOpen,
            inputValue,
            highlightedIndex,
            selectedItem,
            getRootProps,
            }) => (
            <div>
                <div
                {...getRootProps({}, {suppressRefError: true})}
                >
                <Input {...getInputProps({placeholder: 'Favorite Fruit?'})} fluid/>
                </div>
                <div {...getMenuProps()}>
                {isOpen
                    ? getTeamMembers
                        .filter(item => !inputValue || item.username.includes(inputValue.toLowerCase()))
                        .map((item, index) => (
                        <div
                            {...getItemProps({
                            key: item.id,
                            item,
                            style: {
                                backgroundColor:
                                highlightedIndex === index ? 'lightgray' : 'white',
                                fontWeight: selectedItem === item ? 'bold' : 'normal',
                            },
                            })}
                        >
                            {item.username}
                        </div>
                        ))
                    : null}
                </div>
            </div>
            )}
				</Downshift>
				)}
        </Form.Field>
        <Form.Group widths="equal">
            <Button fluid onClick={onClose}>Cancel</Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
)

const getTeamMembersQuery = gql`
   query($teamId: Int!){
		 getTeamMembers(teamId: $teamId){
			 id
			 username
		 }
	 }
`;

export default withRouter(graphql(getTeamMembersQuery)(DirectMessageModal));