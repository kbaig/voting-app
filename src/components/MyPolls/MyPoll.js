import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import { ReactComponent as DownArrow } from '../../svg/down-arrow.svg';
import { ReactComponent as UpArrow } from '../../svg/up-arrow.svg';

class MyPoll extends Component {
    constructor () {
        super();

        this.state = {
            expanded: false
        };
    }

    share = () => {
        navigator.clipboard
        .writeText(`http://localhost:3000/polls/${this.props.poll.id}`)
        .then(text => console.log('succesfully copied'))
        .catch(err => console.log('failed to copy'));
    }

    toggleExpanded = () => {
        this.setState(prevState => ({
            ...prevState,
            expanded: !prevState.expanded
        }));
    }

    render () {
        const { state, props, share, toggleExpanded } = this;
        const { expanded } = state;
        const { poll, removePoll } = props;
        const { id, name } = poll;       
        
        return (
            <li>
                <div className='top-row'>
                    <Link to={ `/polls/${id}` }>{ name }</Link>
                    <button className='expand' onClick={ toggleExpanded }>{ expanded ? <UpArrow /> : <DownArrow /> }</button>
                </div>
                
                { expanded && <>
                    <div>details: { id }</div>
                    <div className='bottom-row'>
                        <button onClick={ removePoll }>Delete</button>
                        <button onClick={ share }>Share</button>                        
                    </div>
                    
                </> }

            </li>
        );
    }
}

export default MyPoll;