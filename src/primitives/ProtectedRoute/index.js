import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ path, isAuthenticated, component: Component, ...componentProps }) => (
    <Route
        path={ path }
        render={ routeProps => isAuthenticated ? 
            <Component { ...componentProps } { ...routeProps } /> :
            <Redirect to={{
                pathname: '/login',
                state: { from: routeProps.location }
            }} />
        }
    />            
);

export default ProtectedRoute;