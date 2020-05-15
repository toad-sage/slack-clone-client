import React, { Component } from 'react'
import {Form,Message , Input, Container, Header, Button } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

class Register extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            username: '',
            usernameError:'',
            email: '',
            emailError: '',
            password: '',
            passwordError:''
        }
    }

    onChange = e =>{
        const { name , value } = e.target;
        this.setState({ [name]: value });
    }

    onCompleted = data => {
        const {ok,errors} = data.register;
        // console.log(ok,errors)
        if(ok){
            this.props.history.push('/login');
        }else{
            const err = {};
            errors.forEach(({path,message}) => {
                err[`${path}Error`] = message;
            });
            
            this.setState(err);
            // console.log(this.state)
        }
    }

    datas = null;

    render() {

        const { username , email ,password ,usernameError , emailError,passwordError } = this.state

        const errorList = [];
        if(usernameError){
            errorList.push(usernameError)
        }

        if(emailError){
            errorList.push(emailError);
        }

        if(passwordError){
            errorList.push(passwordError);
        }

        return (
            <Mutation mutation={registerMutation} onCompleted = {data => this.onCompleted(data)}>
            {(addRegister,{data}) => { 
              return  (
                <Container text>
                <Header as='h2'>Register</Header>
                <Form>
                    <Form.Field error={usernameError ? true : false}>
                        <Input 
                            fluid 
                            name="username"
                            onChange={this.onChange}
                            value={username}
                            icon='user' 
                            placeholder='Username' 
                        />
                    </Form.Field>
                    <Form.Field error={emailError  ? true : false}>
                        <Input 
                            fluid 
                            onChange={this.onChange}
                            value={email}
                            name="email"
                            icon='at' 
                            placeholder='Email' 
                        />
                    </Form.Field>
                    <Form.Field error={passwordError  ? true : false}>
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
                    <Button onClick={ (e) => {
                        e.preventDefault();
                        const { username , email ,password } = this.state
                        this.setState({
                            usernameError:'',
                            passwordError: '',
                            emailError: ''
                        })
                        addRegister({variables: {
                            username: username,
                            email: email,
                            password: password
                        }})
                    }} primary>Submit</Button>
                </Form>
                {errorList.length ? (<Message
                        error
                        header='There was some errors with your submission'
                        list={errorList}
                    /> ) : null}
              </Container>
            )}}
          </Mutation>
        )
    }
}

const registerMutation = gql `
    mutation($username: String!, $email: String!, $password: String!) {
        register(username: $username,email: $email,password: $password){
            ok
            errors {
                path 
                message
            }
        }
    }
`;

export default Register
