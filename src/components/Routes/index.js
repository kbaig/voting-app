import React, { Component } from 'react';

import { Route } from 'react-router-dom';

import ProtectedRoute from '../../primitives/ProtectedRoute';
import ProtectedAgainstAuthRoute from '../../primitives/ProtectedAgainstAuthRoute';

import Home from '../Home';
import Polls from '../Polls';
import Poll from '../Poll';
import MyPolls from '../MyPolls';
import CreatePollForm from '../CreatePollForm';
import Login from '../Login';
import SignUpForm from '../SignUpForm';


class Main extends Component {
    render () {
        const { isAuthenticated, token, login, logout, user } = this.props;

        return (
            <main className='Routes'>
                <Route path='/' exact component={ Home } />
                <Route path='/polls/' exact component={ Polls } />
                <Route path='/polls/:id/' render={ props => <Poll
                    { ...props }
                    isAuthenticated={ isAuthenticated }
                    token={ token }
                    logout={ logout }
                    /> }
                />
                <ProtectedRoute path='/my-polls/'
                    isAuthenticated={ isAuthenticated }
                    token={ token }
                    logout={ logout }
                    component={ MyPolls }
                    user={ user }
                />
                <ProtectedRoute
                    path='/create/'
                    isAuthenticated={ isAuthenticated }
                    token={ token }
                    logout={ logout }
                    component={ CreatePollForm }
                />
                <ProtectedAgainstAuthRoute
                    path='/login/'
                    isAuthenticated={ isAuthenticated }
                    component={ Login }
                    login={ login }
                />
                <ProtectedAgainstAuthRoute
                    path='/signup/'
                    component={ SignUpForm }
                    isAuthenticated={ isAuthenticated }
                    login={ login }
                />
            </main>
        );
    }
}

export default Main;
