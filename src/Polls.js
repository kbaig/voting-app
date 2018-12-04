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
      const { error, polls } = await response.json();
      
      if (error) {
        console.log({ error });
      } else {
        this.setState({ polls });
      }      
    } catch (error) {
      console.log({ error });
    }
  }

  render () {
    console.log(this.state);
    const polls = this.state.polls.map(poll => {
      const { id, name } = poll;
      return (<Link key={ id } to={ `/polls/${id}` } >{ name }</Link>);
    });

    return (
      <div>
        { polls }
      </div>
    );
  }
}

export default Polls;