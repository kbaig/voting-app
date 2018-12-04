import React, { Component } from 'react';

import { Link } from 'react-router-dom';

class MyPoll extends Component {
    share = () => {
        navigator.clipboard
        .writeText(`http://localhost:3000/polls/${this.props.poll.id}`)
        .then(text => console.log('succesfully copied'))
        .catch(err => console.log('failed to copy'));
    }

    render () {
        const { poll, removePoll } = this.props;
        const { id, name } = poll;
        const { share } = this;
        return (
            <>
                <Link to={ `/polls/${id}` }>{ name }</Link>
                <button onClick={ removePoll }>Delete</button>
                <button onClick={ share }>Share</button>
            </>
        );
    }
}

export default MyPoll;