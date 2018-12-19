import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';

class RedirectOnLogin extends Component {
    constructor () {
        super();

        this.state = { redirect: false };
    }

    login = token => {
        this.props.login(token);
        this.setState({ redirect: true });
    }

    render () {
        const { login, state, props } = this;
        const { redirect } = state;
        const { location, render } = props;
        const { from } = location.state ? location.state : { from: { pathname: '/my-polls' } };

        return (redirect ?
            <Redirect to={ from } /> :
            render(login)
        );
    }
}

export default RedirectOnLogin;