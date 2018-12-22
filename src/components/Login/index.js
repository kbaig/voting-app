import React from 'react';

// import RedirectOnLogin from '../../primitives/RedirectOnLogin';

import BasicLogin from './BasicLogin';
import GitHubLogin from '../GitHubLogin';

// const Login = ({ login, location, flashError }) => (
//     <RedirectOnLogin login={ login } location={ location } render={ newLogin =>
//         <>
//             <BasicLogin login={ newLogin } flashError={ flashError } />
//             <GitHubLogin login={ newLogin } />
//         </>
//     } />
// );

const Login = ({ login, flashError }) => (
    
        <>
            <BasicLogin login={ login } flashError={ flashError } />
            <GitHubLogin login={ login } />
        </>
    
);

export default Login;