import React, { Component } from 'react';

import { Link } from 'react-router-dom';

class Polls extends Component {
  render () {
    const polls = this.props.polls.map(poll => {
      const { _id, name } = poll;
      return <Link key={ _id } to={ `/polls/${_id}` } >{ name }</Link> 
    });

    return (
      <div>
        { polls }
      </div>
    );
  }
}

export default Polls;