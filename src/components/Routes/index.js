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

import './Routes.sass';


class Main extends Component {
    render () {
        const { isAuthenticated, token, login, logout, user, flashError } = this.props;

        return (
            <main className='Routes'>
                <Route path='/' exact component={ Home } />
                <Route path='/polls/' exact render={ () => <Polls flashError={ flashError } /> } />
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
                    flashError={ flashError }
                />
                <ProtectedRoute
                    path='/create/'
                    isAuthenticated={ isAuthenticated }
                    token={ token }
                    logout={ logout }
                    component={ CreatePollForm }
                    flashError={ flashError }
                />
                <ProtectedAgainstAuthRoute
                    path='/login/'
                    isAuthenticated={ isAuthenticated }
                    component={ Login }
                    login={ login }
                    flashError={ flashError }
                />
                <ProtectedAgainstAuthRoute
                    path='/signup/'
                    component={ SignUpForm }
                    isAuthenticated={ isAuthenticated }
                    login={ login }
                    flashError={ flashError }
                />
            </main>
        );
    }
}

export default Main;
