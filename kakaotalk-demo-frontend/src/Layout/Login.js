import React, { Component } from 'react'
import './Login.scss'

export default class Login extends Component {

    state = {
        id: '',
    }
    
    render() {
        return (
            <div className='login'>
                <div className='login-box'>
                    <input onChange={e => this.setState({ id: e.target.value })}></input>
                    <div className='login-button' onClick={() => this.props.onLogin(this.state.id)}>로그인</div>
                </div>
            </div>
        )
    }
}
