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
        const { focus, label, hint, error, ...rest } = this.props;
        return (
            <div className='FormInput'>
                <label>
                    <div className='Label'>{ label }</div>
                    <div className='Hint'>{ hint }</div>
                    <input { ...rest } ref={ this.ref }/>
                </label>
                <div className='Error'>{ error }</div>
            </div>
            
            
        );
    }
}

export default FormInput;