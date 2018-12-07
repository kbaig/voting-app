import React, { Component } from 'react';

import { Link } from 'react-router-dom';

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
    const polls = this.state.polls.map(poll => {
      const { id, name } = poll;
      return (<li key={ id }><Link to={ `/polls/${id}` } >{ name }</Link></li>);
    });

    return (
      <>
        <h1>Polls</h1>
        <ul className='Polls'>
          { polls }
        </ul>
      </>
    );
  }
}

export default Polls;