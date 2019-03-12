import React, { Component } from 'react'
import SocketIOClient from 'socket.io-client'
import Main from 'Layout/Main'
import Login from 'Layout/Login'

class App extends Component {

	state = {
		isLoggedIn: false,
	}

	constructor() {
		super()
		this.socket = SocketIOClient(process.env.REACT_APP_BACKEND_URL)
		this.socket.on('login_success', () => this.setState({ isLoggedIn: true }))
		this.socket.on('disconnected_by_reconnection', () => this.setState({ isLoggedIn: false }, () => alert('다른 환경에서 접속되어 로그아웃되었습니다.')))
	}

	render() {
		return this.state.isLoggedIn ? <Main socket={this.socket} /> : <Login socket={this.socket} />
	}
}

export default App
