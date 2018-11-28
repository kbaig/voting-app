import React, { Component } from 'react';

import { Link } from 'react-router-dom';

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
      const polls = await response.json();
    
      this.setState({ polls });
    } catch (err) {
      console.log(err);
    }
  }

  render () {
    const polls = this.state.polls.map(poll => {
      const { _id, name } = poll;
      return (<Link key={ _id } to={ `/polls/${_id}` } >{ name }</Link>);
    });

    return (
      <div>
        { polls }
      </div>
    );
  }
}

export default Polls;