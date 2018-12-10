import React, { Component, createRef } from 'react';

import './FormInput.sass';

class FormInput extends Component {
    constructor () {
        super();

        this.ref = createRef();
    }

    componentDidMount () {
        if (this.props.focus) {
            this.ref.current.focus();
        }
    }

    render () {
        const { focus, ...rest } = this.props;
        return (
            <input className='FormInput' { ...rest } ref={ this.ref }/>
        );
    }
}

export default FormInput;