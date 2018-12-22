// import React, { Component } from 'react';
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// const ProtectedAgainstAuthRoute = ({ isAuthenticated, component: Component, path, ...rest }) => (
//     <Route
//         path={ path }
//         render={ props => (
//             isAuthenticated ? <Redirect to='/my-polls' /> : <Component { ...props } { ...rest } />
//         ) }
//     />
// );

const ProtectedAgainstAuthRoute = ({ path, component: Component, isAuthenticated, ...rest }) => (
    <Route path={ path } render={({ location }) => {
        const { from } = location.state ? location.state : { from: { pathname: '/my-polls' } };
        
        return isAuthenticated ? <Redirect to={ from } /> : <Component { ...rest } />;
    }} />
);

// class ProtectedAgainstAuthRoute extends Component  {
//     constructor (props) {
//         super(props);

//         this.state = { redirect: props.isAuthenticated };
//     }

//     componentDidMount () {
//         if (this.props.isAuthenticated && !this.state.redirect) this.setState({ redirect: true });
//     }

//     componentDidUpdate () {
//         if (this.props.isAuthenticated && !this.state.redirect) this.setState({ redirect: true });
//     }

//     // componentDidMount () {
//     //     if (this.props.isAuthenticated !== this.state.redirect) this.setState({ redirect: this.props.isAuthenticated });
//     // }

//     // componentDidUpdate (prevProps) {
//     //     if (this.props.isAuthenticated !== prevProps.isAuthenticated) this.setState({ redirect: this.props.isAuthenticated });
//     // }

//     render () {
//         console.log(this.state.redirect, this.props.isAuthenticated);
//         const { state, props } = this;
//         // const { redirect } = state;
//         const { path, component: Component, isAuthenticated, ...rest } = props;
        
//         return (
//             <Route path={ path } render={({ location }) => {
//                 const { from } = location.state ? location.state : { from: { pathname: '/my-polls' } };
//                 console.log({ state, props })
//                 return (isAuthenticated ?
//                     <Redirect to={ from } /> :
//                     <Component { ...rest } />
//                 );
//             }} />
//         );


//     }
// }

export default ProtectedAgainstAuthRoute;