import React, { Component } from 'react';

import tokenExpIsValid from '../../utils/tokenExpIsValid';

class LogoutIfInvalidToken extends Component {
    constructor (props) {
        super(props);

        if (!tokenExpIsValid(props.exp)) props.logout();
    }

    componentDidUpdate() {
        if (!tokenExpIsValid(this.props.exp)) this.props.logout();
    }

    render () {
        return this.props.render();
    }
}

export default LogoutIfInvalidToken;