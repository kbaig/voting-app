import React from 'react';
// import { Route, Redirect } from 'react-router-dom';
import { Route } from 'react-router-dom';

// const ProtectedAgainstAuthRoute = ({ isAuthenticated, component: Component, path, ...rest }) => (
//     <Route
//         path={ path }
//         render={ props => (
//             isAuthenticated ? <Redirect to='/my-polls' /> : <Component { ...props } { ...rest } />
//         ) }
//     />
// );

const ProtectedAgainstAuthRoute = ({ isAuthenticated, component: Component, path, ...rest }) => (
    <Route
        path={ path }
        render={ props => (
            <Component { ...props } { ...rest } />
        ) }
    />
);

export default ProtectedAgainstAuthRoute;