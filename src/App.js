import React, { Component } from 'react';
import './App.css';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Home from './Home';
import Polls from './Polls';
import Poll from './Poll';
import CreatePollForm from './CreatePollForm';

class App extends Component {
  constructor () {
    super();

    this.state = { polls: [] };
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

  render() {
    return <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to='/'>Home</Link>
            </li>
            <li>
              <Link to='/polls/'>Polls</Link>
            </li>
            <li>
              <Link to='/create/'>Create A Poll</Link>
            </li>
          </ul>
        </nav>


      <Route path='/' exact component={ Home } />
      <Route path='/polls/' exact render={ () => <Polls polls={ this.state.polls } /> } />
      <Route path='/polls/:id' render={ props => <Poll
          { ...props }
          poll={ this.state.polls.find(poll => poll._id === props.match.params.id) }
          vote={ this.vote }
          updatePoll={ this.updatePoll }
        /> 
      } />
      <Route path='/create/' render={ () => <CreatePollForm addPoll={ this.addPoll } /> } />

      </div>
    </Router>;
  }
}

export default App;
