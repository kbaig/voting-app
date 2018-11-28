import React, { Component } from 'react';


class GitHubLogin extends Component {
    
    authenticate = () => {
        const authWindow = window.open('http://localhost:3001/api/auth/github', '', 'width:50,height:50,left:0,right:0');
        authWindow.focus();

        const listenerHandler = async event => {
            if (event.origin === window.location.origin && event.data.code) {

                // remove message listener and close popup
                window.removeEventListener('message', listenerHandler);
                authWindow.close();

                // exchange code for profile data as jwt
                try {
                    const response = await fetch('http://localhost:3001/api/auth/github', {
                        method: 'POST',
                        headers: { 'content-type': 'application/json' },
                        body: JSON.stringify(event.data)
                    });
                    const token = await response.json();
                    console.log(token);

                    // pass jwt to app
                    this.props.login(token);
                    
                } catch (err) {
                    console.log('error: ', err)
                }


            }
        }

        window.addEventListener('message', listenerHandler);
    }

    render() {
        return (
            <button onClick={ this.authenticate }>
                Log in with GitHub
            </button>
        );
    }
}

export default GitHubLogin;