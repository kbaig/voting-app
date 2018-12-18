import React, { Component } from 'react';

import MyPoll from './MyPoll';
import DeleteConfirmationModal from './DeleteConfirmationModal';

import './MyPolls.sass';

class MyPolls extends Component {
    constructor () {
        super();

        this.state = {
            polls: [],
            deleteConfirmationModalId: null,
            copiedtoClipboardId: null
        };
    }

    async componentDidMount () {
        const { id } = this.props.user;
        try {
            const response = await fetch(`http://localhost:3001/api/polls/user/${id}`);

            if (response.ok) {
                const { polls } = await response.json();
                this.setState({ polls });
            } else {
                const { error } = await response.json();
                this.handleResponseError(response.status, error);
            }

        } catch (error) {
            this.props.flashError(error);
        }
    }

    removePoll = id => async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/polls/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${this.props.token}` }
            });

            if (response.ok) {
                const { deletedPoll } = await response.json();
                this.setState(prevState => ({
                    ...prevState,
                    polls: prevState.polls.filter(poll => poll.id !== deletedPoll.id),
                    deleteConfirmationModalId: null
                }));
            } else {
                const { error } = await response.json();
                this.handleResponseError(response.status, error);
            }

        } catch (error) {
            this.props.flashError(error);
        }
    }

    handleResponseError = (status, error) => {
        if (status === 500) return this.props.flashError(error);
        else if (status === 401) return console.log(`error 401: ${error}`);
    }

    cancelDeletion = () => {
        this.setState({ deleteConfirmationModalId: null });
    }
    
    requestDeletionConfirmation = id => () => {
        this.setState({ deleteConfirmationModalId: id });
    }

    copyToClipboard = id => () => {
        navigator.clipboard
        .writeText(`http://localhost:3000/polls/${id}`)
        .then(text => {
            console.log(`copied to clipboard: ${id}`);
            this.setState({ copiedtoClipboardId: id });
        })
        .catch(err => this.props.flashError('Failed to copy. Please try again'));
    }

    render () {
        const { removePoll, cancelDeletion, requestDeletionConfirmation, copyToClipboard, state } = this;
        const { polls, deleteConfirmationModalId, copiedtoClipboardId } = state;

        return (
            <>
                <ul className='MyPolls'>
                    { polls.map(poll => <MyPoll
                        key={ poll.id }
                        poll={ poll }
                        requestDeletionConfirmation={ requestDeletionConfirmation(poll.id) }
                        url={ `http://localhost:3000/polls/${poll.id}` }
                        copyToClipboard={ copyToClipboard(poll.id) }
                        copied={ poll.id === copiedtoClipboardId }
                    />) }
                </ul>

                { deleteConfirmationModalId && <DeleteConfirmationModal
                    cancelDeletion={ cancelDeletion }
                    confirmDeletion={ removePoll(deleteConfirmationModalId) }
                /> }
            </>
        );
    }
}

export default MyPolls;