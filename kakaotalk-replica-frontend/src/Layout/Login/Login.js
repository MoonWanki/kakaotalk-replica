import React, { Component } from 'react'
import './Login.scss'

export default class Login extends Component {
    
    render() {
        return (
            <div className='login'>
                <div className='login-box'>
                    <input onChange={this.props.onIdTextChange} value={this.props.id}></input>
                    <div className='login-button' onClick={this.props.onLoginButtonClick}>로그인</div>
                    <input type="checkbox" />자동로그인
                </div>
            </div>
        )
    }
}
