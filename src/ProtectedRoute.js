import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, component: Component, passDown, ...rest }) => (
    <Route
        { ...rest }
        render={ props => (
            isAuthenticated ? <Component {...props } { ...passDown } /> : <Redirect to='/login' />
        ) }
    />
);

export default ProtectedRoute;