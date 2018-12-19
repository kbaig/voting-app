import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

import LogoutIfInvalidToken from '../LogoutIfInvalidToken';

const ProtectedRoute = ({ path, isAuthenticated, component: Component, ...componentProps }) => (
    <Route
        path={ path }
        render={ routeProps => isAuthenticated ? 
            <LogoutIfInvalidToken
                exp={ componentProps.user.exp }
                logout={ componentProps.logout }
                render={ () => <Component { ...componentProps } { ...routeProps } /> }
            /> :
            <Redirect to={{
                pathname: '/login',
                state: { from: routeProps.location }
            }} />
        }
    />            
);

export default ProtectedRoute;