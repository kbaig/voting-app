import React, { Component } from 'react';
import queryString from 'query-string';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import ProtectedAgainstAuthRoute from './ProtectedAgainstAuthRoute';

import Home from './Home';
import Polls from './Polls';
import Poll from './Poll';
import MyPolls from './MyPolls';
import CreatePollForm from './CreatePollForm';
import Login from './Login';
import SignUpForm from './SignUpForm';

import './App.css';

class App extends Component {
  constructor () {
    super();

    // determine if this is a popup being sent a github auth token, and send a message to parent if so
    if (window.opener) {
      const query = queryString.parse(window.location.search);
      if (query.code) {
        window.opener.postMessage({ code: query.code }, "http://localhost:3000");
        window.stop();
      }
    }

    // proceed as usual by pulling token from localstorage and/or setting state
    const token = localStorage.getItem('token');
    const tokenExists = !!token;

    this.state = {
      isAuthenticated: tokenExists,
      token: tokenExists ? token : null,
      user: tokenExists ? this.tokenToUser(token): null
    };
  }

  // parse token and return formatted payload
  tokenToUser = token => JSON.parse(atob(token.match(/\.(\w+)\./)[1]));

  login = token => {
    localStorage.setItem('token', token);

    const user = this.tokenToUser(token);   

    console.log('logged in user', user);

    this.setState({
      isAuthenticated: true,
      token,
      user
    });
  }

  logout = () => {
    localStorage.clear();

    this.setState({
      isAuthenticated: false,
      token: null,
      user: null
    });
  }

  render() {
    const { isAuthenticated, token, user } = this.state;
    const { login, logout } = this;

    return <Router>
      <div>

        <nav>
          <ul>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/polls/'>Polls</Link></li>
            { isAuthenticated && <li><Link to='/my-polls/'>My Polls</Link></li> }            
            { isAuthenticated && <li><Link to='/create/'>Create A Poll</Link></li> }
            { isAuthenticated ?
              <button onClick={ logout }>Logout</button> :
              <>
                <li><Link to='/login/'>Login</Link></li>
                <li><Link to="/sign-up">Sign Up</Link></li>
              </>
            }
            
          </ul> 
        </nav>

        { isAuthenticated && `You are logged in as ${user.name} whose email is ${user.email}.` }

        <Route path='/' exact component={ Home } />
        <Route path='/polls/' exact component={ Polls } />
        <Route path='/polls/:id/' render={ props => <Poll
          { ...props }
          isAuthenticated={ isAuthenticated }
          token={ token }
          logout={ logout }
          /> }
        />
        <ProtectedRoute path='/my-polls/'
          isAuthenticated={ isAuthenticated }
          token={ token }
          logout={ logout }
          component={ MyPolls }
          user={ user }
        />
        <ProtectedRoute
          path='/create/'
          isAuthenticated={ isAuthenticated }
          token={ token }
          logout={ logout }
          component={ CreatePollForm }
        />
        <ProtectedAgainstAuthRoute
          path='/login/'
          isAuthenticated={ isAuthenticated }
          component={ Login }
          login={ login }
        />
        <ProtectedAgainstAuthRoute
          path='/sign-up/'
          component={ SignUpForm }
          isAuthenticated={ isAuthenticated }
          login={ login }
        />
        
      </div>
    </Router>;
  }
}

export default App;
