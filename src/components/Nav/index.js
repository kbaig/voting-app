import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import Button from '../../primitives/Button';

import './Nav.sass';

class Nav extends Component {
    render () {
        const { isAuthenticated, user, logout } = this.props;

        return (
            <nav className='Nav'>
                <ul>
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/polls/'>Polls</Link></li>
                    { isAuthenticated && <li><Link to='/my-polls/'>My Polls</Link></li> }            
                    { isAuthenticated && <li><Link to='/create/'>Create A Poll</Link></li> }
                    { isAuthenticated ?
                    <>
                        <li>{ user.name }</li>
                        <li><Button type='button' value='Log Out' onClick={ logout } /></li>
                    </> :
                    <>
                        <li><Link to='/login/'>Login</Link></li>
                        <li><Link to="/signup/">Sign Up</Link></li>
                    </>
                    }
                </ul> 
            </nav>
        );
    }
}

export default Nav;