import React, { Component } from 'react';


class GitHubLogin extends Component {
    
    authenticate = () => {
        const authWindow = window.open('http://localhost:3001/api/auth/github', '', 'width:50,height:50,left:0,right:0');
        authWindow.focus();

        // check every 100ms to see if the popup has been closed, removing the message listener if so
        // needs to be done via setInterval since window.beforeunload only works if the popup is on the same domain
        const interval = setInterval(() => {
            if (authWindow.closed) {
                window.removeEventListener('message', listenerHandler);
                clearInterval(interval);
            }
        }, 100);

        const listenerHandler = async event => {
            if (event.origin === window.location.origin && event.data.code) {

                // remove message listener and close popup
                window.removeEventListener('message', listenerHandler);
                authWindow.close();

                try {
                    // exchange code for profile data as jwt
                    const response = await fetch('http://localhost:3001/api/auth/github', {
                        method: 'POST',
                        headers: { 'content-type': 'application/json' },
                        body: JSON.stringify(event.data)
                    });
                    const responseData = await response.json();

                    const { error, token } = responseData;
                    if (error) {
                        console.log({ error });
                    } else {
                        // pass jwt to app
                        console.log({ token });
                        this.props.login(token);
                    }

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