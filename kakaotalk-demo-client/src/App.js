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
		this.socket = SocketIOClient(process.env.REACT_APP_SERVER_URL)
		this.socket.on('login_success', () => this.setState({ isLoggedIn: true }))
	}

	render() {
		return this.state.isLoggedIn ? <Main socket={this.socket} /> : <Login socket={this.socket} />
	}
}

export default App
