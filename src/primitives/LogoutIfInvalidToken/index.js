import { Component } from 'react';

import tokenExpIsValid from '../../utils/tokenExpIsValid';

class LogoutIfInvalidToken extends Component {
    constructor () {
        super();

        this.state = { show: false };
    }

    componentDidMount () {
        this.props.exp && !this.tokenIsValid() ? this.props.logout() : this.setState({ show: true });
    }

    componentDidUpdate() {
        if (this.state.show && this.props.exp && !this.tokenIsValid()) {
            this.props.logout();
        } else if (!this.props.exp && !this.state.show) {
            this.setState({ show: true });
        }
    }

    tokenIsValid = () => tokenExpIsValid(this.props.exp);

    render () {
        return this.state.show && this.props.render();
    }
}

export default LogoutIfInvalidToken;