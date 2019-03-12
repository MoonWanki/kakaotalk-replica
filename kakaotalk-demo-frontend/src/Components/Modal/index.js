import React, { Component } from 'react'
import './index.scss'

export default class Modal extends Component {
    render() {
        return (
            <div className='modal'>
                <div className='modal-inner'>
                    <div className='modal-header' />
                    {this.props.children}
                </div>
            </div>
        )
    }
}
