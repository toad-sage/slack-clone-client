/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from 'react'
import { BrowserRouter , Route , Switch,Redirect } from 'react-router-dom';
import decode from 'jwt-decode';

import Home from './Home'
import Register from './Register'
import Login from './Login'
import CreateTeam from './CreateTeam'
import ViewTeam from './ViewTeam';

const isAuthenticated = () => {
  // console.log(`entered`)
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshtoken');
  // console.log(token);
  // console.log(refreshToken)
  try{
    decode(token);
    decode(refreshToken);
  }catch(err){
    return false;
  }
  console.log(`lets see its true or not`)
  return true;
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      (isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
          }}
        />
      ))}
  />
)

  export default () => (
    <BrowserRouter>
        <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/register" exact component={Register} />
            <Route path="/login" exact component={Login} />
            <Route path="/view-team/:teamId?/:channelId?" exact component={ViewTeam}></Route>
            <PrivateRoute path="/createTeam" exact component={CreateTeam} />
        </Switch>
    </BrowserRouter>
  )
