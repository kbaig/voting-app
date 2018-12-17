import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import RouteHeading from '../../primitives/RouteHeading';

import './Polls.sass';

class Polls extends Component {
  constructor () {
    super();

    this.state = {
      polls: []
    }
  }

  async componentDidMount () {
    try {
      const response = await fetch('http://localhost:3001/api/polls');
      
      if (response.ok) {
        const { polls } = await response.json();
        this.setState({ polls });
      } else {
        const { error } = await response.json();
        this.props.flashError(error);
      }

    } catch (error) {
      this.props.flashError(error);
    }
  }

  render () {
    const polls = this.state.polls.map(poll => {
      const { id, name, options, creator_id } = poll;
      const totalVotes = options.reduce((acc, option) => acc + option.votes, 0);

      return (
        <li key={ id }><Link to={ `/polls/${id}` }>

          <div className='PollName'>{ name }</div>

          <div className='PollDetails'>
            <div>Created by <span className='CreatorName'>{ creator_id }</span></div>
            <div><span className='VoteCount'>{ totalVotes }</span> votes</div>
          </div>
          
        </Link></li>
      );
    });

    return (
      <>
        <RouteHeading>Polls</RouteHeading>
        <ul className='Polls'>
          { polls }
        </ul>
      </>
    );
  }
}

export default Polls;