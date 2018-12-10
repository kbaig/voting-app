import React, { Component } from 'react';
import queryString from 'query-string';

import { BrowserRouter as Router } from 'react-router-dom';

import Nav from './components/Nav';
import Routes from './components/Routes';
import Footer from './components/Footer';

import FlashMessage from './primitives/FlashMessage';

import './App.sass';

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
      user: tokenExists ? this._tokenToUser(token): null,
      flashError: false
    };
  }

  // parse token and return formatted payload
  _tokenToUser = token => JSON.parse(atob(token.match(/\.(\w+)\./)[1]));

  login = token => {
    localStorage.setItem('token', token);

    const user = this._tokenToUser(token);   

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

  flashError = () => {
    this.setState({ flashError: true });
    setTimeout(() => this.setState({ flashError: false }), 3000);
  }

  render() {
    const { isAuthenticated, token, user, flashError } = this.state;
    const { login, logout } = this;

    return (
      <Router>
        <div className='App'>

          <Nav isAuthenticated={ isAuthenticated } user={ user } logout={ logout } />
          <Routes
            isAuthenticated={ isAuthenticated }
            token={ token }
            user={ user }
            login={ login }
            logout={ logout }
          />
          <Footer />

          <FlashMessage show={ flashError }>An error has occurred. Please try again.</FlashMessage>

        </div>
      </Router>
    );
  }
}

export default App;
