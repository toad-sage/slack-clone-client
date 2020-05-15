import React, { Component } from 'react';
import {Form, Message,Input, Container, Header, Button } from 'semantic-ui-react'
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import gql from 'graphql-tag'
import { graphql } from '@apollo/react-hoc'

class Login extends Component {

    constructor(props) {
        super(props)
    
        extendObservable(this,{
            email: '',
            password: '',
            errors: {},
        })
    }

    onChange = e => {
        const {name,value} = e.target;
        this[name] = value;
    }
   
    onSubmit = async (e) => {
        const {email , password}  =this;
        console.log(email,password)
        const response = await this.props.mutate({
            variables: {email , password },
        });
        const { ok , token , refreshToken ,errors } = response.data.login;
        if(ok) {
            console.log(`${ok} ${token} ${refreshToken}`)
            localStorage.setItem('token',token);
            localStorage.setItem('refreshtoken',refreshToken);
            this.props.history.push('/view-team');
        }else{
            const err = {};
            errors.forEach(({path,message}) => {
                err[`${path}Error`] = message;
            });
            
            this.errors = err;
        }
    }

    render() {

        const {email,password,errors: {emailError , passwordError } } = this;

        const errorList = [];

        if(emailError){
            errorList.push(emailError);
        }

        if(passwordError){
            errorList.push(passwordError);
        }

        return (
            <Container text>
                <Header as='h2'>Login</Header>
                <Form>
                <Form.Field error={!!emailError}>
                    <Input 
                        fluid 
                        onChange={this.onChange}
                        value={email}
                        name="email"
                        icon='at' 
                        placeholder='Email' 
                    />
                </Form.Field>
                <Form.Field error={!!passwordError}>
                    <Input 
                        fluid 
                        onChange={this.onChange}
                        value={password}
                        name="password"
                        type="password" 
                        icon='lock' 
                        placeholder='Password' 
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

const loginMutation = gql`
    mutation($email: String! , $password: String!){
    login(email: $email ,password: $password ){
        ok
        token
        refreshToken
        errors{
        path
        message
        }
    }
}`;

export default graphql(loginMutation)(observer(Login))