import React, { Component } from 'react'
import './Button.scss'

export default class Button extends Component {
    render() {

        let className = 'button '
        className += this.props.accent ? 'button-accent ' : 'button-normal '
        className += !this.props.disabled ? this.props.accent ? 'button-accent-active' : 'button-normal-active' : null
        
        return (
            <div onClick={this.props.disabled ? null : this.props.onClick} className={className}>
                {this.props.children}
            </div>
        )
    }
}
