import React, { Component } from 'react'
import './Login.scss'

export default class Login extends Component {

    state = {
        id: '',
		unregistered: false,
		alreadyConnected: false,
    }

    constructor(props) {
        super(props)
        props.socket.on('unregistered', this.handleUnregistered)
        props.socket.on('already_connected', this.handleAlreadyConnected)
    }

    handleUnregistered = () => {
        this.setState({ unregistered: true })
    }

    handleAlreadyConnected = () => {

    }

    login = () => {
        this.props.socket.emit('login', this.state.id)
    }

    forceLogin = () => {
        this.props.socket.emit('force_login')
    }
    
    render() {
        return (
            <div className='login'>
                <div className='login-box'>
                    <input onChange={e => this.setState({ id: e.target.value})}></input>
                    <div className='login-button' onClick={this.login}>로그인</div>
                    {this.state.unregistered && '등록되지 않은 id입니다.'}
                    {this.state.alreadyConnected && '이미 접속중입니다.'}
                </div>
            </div>
        )
    }
}
