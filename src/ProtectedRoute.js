import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, component: Component, path, ...rest }) => (
    <Route
        path={ path }
        render={ props => (
            isAuthenticated ? <Component { ...props } { ...rest } /> : <Redirect to='/login' />
        ) }
    />
);

export default ProtectedRoute;