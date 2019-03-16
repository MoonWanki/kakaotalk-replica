import React, { Component } from 'react'
import './Dialog.scss'

export default class Dialog extends Component {

    render() {
        return (
            <div className='dialog'>
                <div className='dialog-inner'>
                    {this.props.children}
                </div>
            </div>
        )
    }
}
