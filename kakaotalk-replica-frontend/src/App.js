import React, { Component, Fragment } from 'react'
import SocketIOClient from 'socket.io-client'
import { Dialog, Button } from 'Components'
import { Login, Main } from 'Layout'



class App extends Component {

	socket = SocketIOClient(process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000')

	state = {
		myInfo: null,
		kickedDialogOpen: false,
		autoLoginEnabled: false,
	}

	constructor() {
		super()
		this.socket.on('login_success', this.onLoginSuccess)
		this.socket.on('logout_success', this.onLogoutSuccess)
		this.socket.on('kicked', this.onKicked)
	}

	onLoginSuccess = myInfo => {
		this.setState({ myInfo: myInfo })
	}

	onLogoutSuccess = () => {
		this.setState({ myInfo: null })
	}

	onKicked = () => this.setState({ myInfo: null, kickedDialogOpen: true })
			
    render() {
        return (
			<Fragment>
				{this.state.myInfo
				? <Main socket={this.socket} myInfo={this.state.myInfo} onLogout={this.logout} />
				: <Login socket={this.socket} onLoginSuccess={this.onLoginSuccess} kickedDialogOpen={this.props.kickedDialogOpen} />}
				{this.state.kickedDialogOpen && <Dialog>
					<div className='dialog-content' autoFocus>다른 브라우저에서 로그인되어 자동으로 로그아웃되었습니다.</div>
					<div className='dialog-actions'>
						<span style={{ margin: 4 }}><Button onClick={() => this.setState({ kickedDialogOpen: false })} accent>확인</Button></span>
					</div>
				</Dialog>}
			</Fragment>
		)
    }
}

export default App
