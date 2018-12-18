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
        const { focus, label, hint, withError, showError, error, ...rest } = this.props;
        return (
            <label className={ `FormInput${ withError && showError && error ? ' Invalid' : '' }` }>
                { label && <div className='Label'>{ label }</div> }                
                { hint && <div className='Hint'>{ hint }</div> }
                <input { ...rest } ref={ this.ref }/>
                { (withError && showError && error) && <div className='Error'>{ error }</div> }
            </label>
        );
    }
}

export default FormInput;