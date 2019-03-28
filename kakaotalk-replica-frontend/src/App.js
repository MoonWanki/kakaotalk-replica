import React, { Component, Fragment } from 'react'
import SocketIOClient from 'socket.io-client'
import { Dialog, Button } from 'Components'
import { Login, Main } from 'Layout'

// 채팅 서버 연결 관리.
// 연결 성공 시, 로그인 여하에 따라 Login 또는 Main을 보여줌.
class App extends Component {

	socket = SocketIOClient(process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000')

	state = {
		connected: false,
		disconnected: false,
		myInfo: null,				// ★ myInfo 존재 여부에 따라 로그인 여부 판별
		kickedDialogOpen: false,
		autoLoginEnabled: false,
	}

	constructor() {
		super()
		this.socket.on('connect', this.onConnect)
		this.socket.on('connect_error', this.onDisconnect)
		this.socket.on('disconnect', this.onDisconnect)
		this.socket.on('login_success', this.onLoginSuccess)
		this.socket.on('logout_success', this.onLogoutSuccess)
		this.socket.on('kicked', this.onKicked)
	}

	componentDidMount() {
		const value = document.cookie.match('(^|;) ?kakaotalk_id=([^;]*)(;|$)')
		const id = value? value[2] : null
		if(id) {
			this.socket.emit('login', id)
		}
	}

	// 서버 연결 성공 시
	onConnect = () => {
		this.setState({ connected: true, disconnected: false })
	}

	// 서버 연결 실패 시
	onDisconnect = () => {
		this.setState({ connected: false, disconnected: true })
		this.onLogoutSuccess()
	}

	// 로그인 성공 시
	onLoginSuccess = myInfo => {
		if(this.state.autoLoginEnabled) {
			document.cookie = `kakaotalk_id=${myInfo.id}` // save cookie if autologin is enabled
		} 
		this.setState({ myInfo: myInfo })
	}

	// 로그아웃 성공 시
	onLogoutSuccess = () => {
		document.cookie = 'kakaotalk_id=; expires=Thu, 01 Jan 1970 00:00:01 GMT;' // remove cookie
		this.setState({ myInfo: null })
	}

	// 강제 로그아웃 당할 때
	onKicked = () => {
		this.setState({ myInfo: null, kickedDialogOpen: true })
	}

	onAutoLoginChange = e => this.setState({ autoLoginEnabled: e.target.value })
			
    render() {
        return (
			<Fragment>
				{this.state.connected && (
					this.state.myInfo
					? <Main socket={this.socket} myInfo={this.state.myInfo} onLogout={this.logout} />
					: <Login socket={this.socket} onLoginSuccess={this.onLoginSuccess} kickedDialogOpen={this.props.kickedDialogOpen} onAutoLoginChange={this.onAutoLoginChange} />
				)}

				{this.state.disconnected &&
					<Dialog>
						<div className='dialog-content' autoFocus>서버에 연결할 수 없습니다.</div>
					</Dialog>
				}

				{this.state.kickedDialogOpen &&
					<Dialog>
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
