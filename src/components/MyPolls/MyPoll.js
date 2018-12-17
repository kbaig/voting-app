import React, { Component, createRef } from 'react';

import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faShareAlt, faClipboard, faCheck } from '@fortawesome/free-solid-svg-icons';

import Button from '../../primitives/Button';

class MyPoll extends Component {
    constructor () {
        super();

        this.urlRef = createRef();

        this.state = {
            showShare: false
        };
    }

    revealShare = () => {
        this.setState({ showShare: true });
    }

    selectUrl = () => {
        this.urlRef.current.select();
    }

    handleUrlCopyClick = () => {
        this.selectUrl();
        this.props.copyToClipboard();
    }

    render () {
        const { revealShare, selectUrl, handleUrlCopyClick, urlRef, state, props } = this;
        const { showShare } = state;
        const { poll, requestDeletionConfirmation, url, copied } = props;
        const { id, name, options } = poll;
        const voteCount = options.reduce((acc, option) => acc + option.votes, 0);
        
        return (
            <li className='MyPoll'>
                <div className='PollInfo'>
                    <Link to={ `/polls/${id}` }>{ name }</Link>                   
                    
                    <div className='VotesAndButtons'>
                        <div className='Votes'><span className='VoteCount'>{voteCount}</span> votes</div>
                        <div>
                            <button className='DeleteButton' onClick={ requestDeletionConfirmation }><FontAwesomeIcon icon={ faTrashAlt } /></button>
                            <button className='ShareButton' onClick={ revealShare }><FontAwesomeIcon icon={ faShareAlt } /></button>
                        </div>
                    </div>                    
                </div>
                

                { true && <div className='SharePoll'>
                    <input className='ShareURL' value={ url } ref={ urlRef } onClick={ selectUrl } readOnly />
                    <Button onClick={ handleUrlCopyClick }> { copied ?
                        <>Copied<FontAwesomeIcon icon={ faCheck } /></> :
                        <>Copy<FontAwesomeIcon icon={ faClipboard } /></>
                    }
                    </Button>
                </div> }
            </li>
        );
    }
}

export default MyPoll;