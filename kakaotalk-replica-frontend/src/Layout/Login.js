import React, { Component } from 'react'
import './Login.scss'

export default class Login extends Component {

    state = {
        id: '',
    }

    componentDidMount() {
        window.onkeydown = e => {
            if(e.keyCode === 13) this.onLoginButtonClick()
        }
    }

    onLoginButtonClick = () => {
        this.props.onLogin(this.state.id)
    }

    componentWillUnmount() {
        window.onkeydown = null
    }
    
    render() {
        return (
            <div className='login'>
                <div className='login-box'>
                    <input onChange={e => this.setState({ id: e.target.value })}></input>
                    <div className='login-button' onClick={this.onLoginButtonClick}>로그인</div>
                </div>
            </div>
        )
    }
}
