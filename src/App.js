import React, { Component } from 'react';
import './App.css';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

import Home from './Home';
import Polls from './Polls';
import Poll from './Poll';
import MyPolls from './MyPolls';
import CreatePollForm from './CreatePollForm';
import Login from './Login';

import queryString from 'query-string';

class App extends Component {
  constructor () {
    super();

    // determine if this is a popup being sent a github auth token, and send a message to parent if so
    const query = queryString.parse(window.location.search);
    if (query.code) {
      window.opener.postMessage({ code: query.code }, "http://localhost:3000");
      window.stop();
    }    

    // proceed as usual by pulling token from localstorage and/or setting state
    const token = localStorage.getItem('token');
    const tokenExists = !!token;

    this.state = {
      polls: [],
      isAuthenticated: tokenExists,
      token: tokenExists ? token : '',
      user: tokenExists ? this.tokenToPayload(token): {}
    };
  }

  async componentDidMount () {
    try {
      const response = await fetch('http://localhost:3001/api/polls');
      const polls = await response.json();
    
      this.setState({ polls });
    } catch (err) {
      console.log(err);
    }
  }

  // parse token and return formatted payload
  tokenToPayload = token => {
    const unformattedPayload = JSON.parse(atob(token.match(/\.(\w+)\./)[1]));
    const { _id: id, github_id, github_login, name, email, avatar } = unformattedPayload;

    return { id, github_id, github_login, name, email, avatar };
  }

  addPoll = async poll => {
    try {
      const response = await fetch('http://localhost:3001/api/polls', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(poll)
      });
      const jsonResponse = await response.json();

      this.setState(prevState => ({ polls: [...prevState.polls, jsonResponse ] }));  
    } catch (err) {
      console.log(err);
    }
  }

  updatePoll = (pollId, updatedPoll) => {
    this.setState(prevState => {
      const polls = prevState.polls.map(poll => poll._id === pollId ? updatedPoll : poll);

      return {
        ...prevState,
        polls
      };
    });
  }

  vote = async (pollId, optionId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/polls/vote/${pollId}/${optionId}`, { method: 'POST' });
      const poll = await response.json();

      this.updatePoll(pollId, poll);
    } catch (err) {
      console.log(err);
    }
  }

  login = token => {
    localStorage.setItem('token', token);

    const user = this.tokenToPayload(token);   

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
      token: '',
      user: {}
    });
  }

  render() {
    const { polls, isAuthenticated, user } = this.state;
    const { addPoll, updatePoll, vote, login, logout } = this;

    return <Router>
      <div>
        <nav>
          <ul>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/polls/'>Polls</Link></li>
            { isAuthenticated && <li><Link to='/my-polls/'>My Polls</Link></li> }            
            { isAuthenticated && <li><Link to='/create/'>Create A Poll</Link></li> }
            <li>{ isAuthenticated ?
              <button onClick={ logout }>Logout</button> :
              <Link to='/login/'>Login</Link>
            }</li>
          </ul> 
        </nav>

        { isAuthenticated && `You are logged in as ${user.name} whose email is ${user.email}.` }

        <Route path='/' exact render={ props => <Home { ...props } /> } />
        <Route path='/polls/' exact render={ () => <Polls polls={ polls } /> } />
        <Route path='/polls/:id/' render={ props => <Poll
            { ...props }
            poll={ polls.find(poll => poll._id === props.match.params.id) }
            vote={ vote }
            updatePoll={ updatePoll }
            isAuthenticated={ isAuthenticated } 
          /> 
        } />
        <ProtectedRoute path='/my-polls/' isAuthenticated={ isAuthenticated } component={ MyPolls } />
        <ProtectedRoute
          path='/create/'
          isAuthenticated={ isAuthenticated }
          component={ CreatePollForm }
          addPoll={ addPoll }
        />
        <Route path='/login/' render={ props => <Login { ...props } isAuthenticated={ isAuthenticated } login={ login } /> } />

      </div>
    </Router>;
  }
}

export default App;
