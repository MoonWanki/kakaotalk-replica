import React, { Component } from 'react'
import { Button } from 'Components'
import './Dialog.scss'

export default class Dialog extends Component {

    render() {
        return (
            <div className='dialog'>
                <div className='dialog-inner'>
                    <div className='dialog-header' />
                    <div className='dialog-content'>{this.props.children}</div>
                    <div className='dialog-actions'>
                        <Button onClick={this.props.onOk} accent>{this.props.okText}</Button>
                        <Button onClick={this.props.onCancel}>{this.props.cancelText}</Button>
                    </div>
                </div>
            </div>
        )
    }
}
