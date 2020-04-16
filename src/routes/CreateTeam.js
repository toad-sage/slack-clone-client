import React, { Component } from 'react';
import {Form, Message,Input, Container, Header, Button } from 'semantic-ui-react'
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import gql from 'graphql-tag'
import { graphql } from '@apollo/react-hoc'

class CreateTeam extends Component {

    constructor(props) {
        super(props)

        extendObservable(this,{
            name: '',
            errors: {},
        })
    }
    //eslint parsing error
    onChange = (e) => {
        const {name,value} = e.target;
        this[name] = value;
    }

    onSubmit = async (e) => {
        const {name }  =this;
        let response = null;
        // console.log(name)
        try {
          response = await this.props.mutate({
              variables: {name },
          });
          console.log(response);
        } catch (e) {
            // console.log(e);
          this.props.history.push('/view-team');
          return ;
        }

        console.log(response);

        const { ok ,errors , team } = response.data.createTeam;
        if(ok) {
            this.props.history.push(`/view-team/${team.id}`);
        }else{
            const err = {};
            errors.forEach(({path,message}) => {
                err[`${path}Error`] = message;
            });

            this.errors = err;
        }
    }

    render() {

        const {name ,errors: {nameError ,} } = this;

        const errorList = [];

        if(nameError){
            errorList.push(nameError);
        }

        return (
            <Container text>
                <Header as='h2'>Create a Team</Header>
                <Form>
                <Form.Field error={!!nameError}>
                    <Input
                        fluid
                        onChange={this.onChange}
                        value={name}
                        name="name"
                        icon='users'
                        placeholder='Name'
                    />
                </Form.Field>
                <Button onClick={this.onSubmit} primary>Submit</Button>
                </Form>
                {errorList.length ? (<Message
                        error
                        header='There was some errors with your submission'
                        list={errorList}
                    /> ) : null}
            </Container>
        )
    }
};

const createTeamMutation = gql`
    mutation($name: String!){
    createTeam(name: $name ){
        ok
        team{
            id
        }
        errors{
        path
        message
        }
    }
}`;

export default graphql(createTeamMutation)(observer(CreateTeam))
