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

class App extends Component {
  constructor () {
    super();

    this.state = {
      polls: [],
      isAuthenticated: false
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

  addPoll = async poll => {
    try {
      const response = await fetch('http://localhost:3001/api/polls', {
          method: 'POST',
          body: JSON.stringify(poll),
          headers: { 'content-type': 'application/json' }
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

  login = () => {
    this.setState({ isAuthenticated: true });
  }

  logout = () => {
    this.setState({ isAuthenticated: false });
  }

  render() {
    const { isAuthenticated, polls } = this.state;
    const { addPoll, updatePoll, vote, login, logout } = this;

    return <Router>
      <div>
        <nav>
          <ul>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/polls/'>Polls</Link></li>
            { isAuthenticated && <li><Link to='/user/id/polls'>My Polls</Link></li> }            
            { isAuthenticated && <li><Link to='/create/'>Create A Poll</Link></li> }
            <li>{ isAuthenticated ?
              <button onClick={ logout }>Logout</button> :
              <Link to='/login/'>Login</Link>
            }</li>
          </ul>
        </nav>

        <Route path='/' exact component={ Home } />
        <Route path='/polls/' exact render={ () => <Polls polls={ polls } /> } />
        <Route path='/polls/:id' render={ props => <Poll
            { ...props }
            poll={ polls.find(poll => poll._id === props.match.params.id) }
            vote={ vote }
            updatePoll={ updatePoll }
            isAuthenticated={ isAuthenticated } 
          /> 
        } />
        <ProtectedRoute path='/user/id/polls' isAuthenticated={ isAuthenticated } component={ MyPolls } />
        <ProtectedRoute
          path='/create/'
          isAuthenticated={ isAuthenticated }
          component={ CreatePollForm }
          passDown={{ addPoll }}
        />
        <Route path='/login/' render={ () => <Login isAuthenticated={ isAuthenticated } login={ login } /> } />

      </div>
    </Router>;
  }
}

export default App;
