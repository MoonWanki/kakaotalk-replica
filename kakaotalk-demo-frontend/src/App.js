import React, { Component, Fragment } from 'react'
import SocketIOClient from 'socket.io-client'
import Main from 'Layout/Main'
import Login from 'Layout/Login'
import Dialog from 'Components/Dialog'

class App extends Component {

	state = {
		id: '',
        nickname: '',
		unregisteredModalOpen: false,
        alreadyConnectedModalOpen: false,
        registerModalOpen: false,
		myInfo: null,
	}

	constructor() {
		super()
		this.socket = SocketIOClient(process.env.REACT_APP_BACKEND_URL)
		this.socket.on('unregistered', () => this.setState({ unregisteredModalOpen: true }))
        this.socket.on('already_connected', () => this.setState({ alreadyConnectedModalOpen: true }))
		this.socket.on('login_success', this.onLoginSuccess)
		this.socket.on('kicked', () => this.setState({ myInfo: null }))
	}

	componentDidMount = () => {
		this.autoLoginIfCookieExist()
	}
	
	autoLoginIfCookieExist = () => {
		const value = document.cookie.match('(^|;) ?kakaotalk_id=([^;]*)(;|$)')
  		const id = value? value[2] : null
		if(id) this.login(id)
	}

    login = id => {
		this.setState({ id })
		this.socket.emit('login', id)
	}
	
	logout = () => {
		this.setState({ myInfo: null })
		this.socket.emit('logout')
		document.cookie = 'kakaotalk_id=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	}

    register = () => {
        this.setState({ registerModalOpen: false })
		this.socket.emit('register', this.state.id, this.state.nickname)
    }

    forceLogin = () => {
        this.setState({ alreadyConnectedModalOpen: false })
        this.socket.emit('force_login')
	}

	onLoginSuccess = myInfo => {
		this.setState({ myInfo: myInfo })
		document.cookie = `kakaotalk_id=${myInfo.id}`
	}
			
    render() {
        return (
            <Fragment>

				{this.state.myInfo
					? <Main socket={this.socket} myInfo={this.state.myInfo} onLogout={this.logout} />
					: <Login onLogin={this.login} />}
				
				{this.state.unregisteredModalOpen && <Dialog
					okText='예' onOk={() => this.setState({ unregisteredModalOpen: false, registerModalOpen: true })}
					cancelText='아니요' onCancel={() => this.setState({ unregisteredModalOpen: false })}>
						<div>
							등록되지 않은 ID입니다.<br />이 아이디로 새로 가입할까요?
						</div>
				</Dialog>}
				
				{this.state.alreadyConnectedModalOpen && <Dialog
					onOk={this.forceLogin} okText='접속'
					cancelText='취소' onCancel={() => this.setState({ alreadyConnectedModalOpen: false })}>
						<div>
							이미 접속 중인 ID입니다.<br />강제 로그아웃 시키고 여기서 접속할까요?
						</div>
				</Dialog>}
				
                {this.state.registerModalOpen && <Dialog
					okText='등록' onOk={this.register}
					cancelText='취소' onCancel={() => this.setState({ registerModalOpen: false })}>
						<div>
							닉네임을 설정해주세요.
							<input onChange={e => this.setState({ nickname: e.target.value })} /><br />
							사용하실 프로필 이미지를 선택해주세요!
						</div>
				</Dialog>}
				
            </Fragment>
        )
    }
}

export default App
