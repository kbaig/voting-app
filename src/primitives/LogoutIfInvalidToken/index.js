import { Component } from 'react';

import tokenExpIsValid from '../../utils/tokenExpIsValid';

class LogoutIfInvalidToken extends Component {
    constructor (props) {
        super(props);

        this.state = { show: false };
    }

    componentDidMount () {
        !this.props.exp || this.tokenIsValid() ? this.setState({ show: true }) : this.props.logout();
    }

    componentDidUpdate() {
        if (this.state.show && this.props.exp && !this.tokenIsValid()) this.props.logout();
    }

    tokenIsValid = () => tokenExpIsValid(this.props.exp);

    render () {
        return this.state.show && this.props.render();
    }
}

export default LogoutIfInvalidToken;