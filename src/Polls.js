import React, { Component } from 'react';

import { Link } from 'react-router-dom';

class Polls extends Component {
  render () {
    const polls = this.props.polls.map(
      (poll, id) => <Link key={ id } to={ `/poll/${id}` } >{ poll.name }</Link>
    );

    return (
      <div>
        { polls }
      </div>
    );
  }
}

export default Polls;