import React, { Component, Fragment } from 'react'
import SocketIOClient from 'socket.io-client'
import { Login, Main } from 'Layout'
import { Dialog } from 'Components'

const thumbnailImages = [
	require('images/thumbnail_1.jpg'), require('images/thumbnail_2.jpg'), require('images/thumbnail_3.jpg'), require('images/thumbnail_4.jpg'),
	require('images/thumbnail_5.jpg'), require('images/thumbnail_6.jpg'), require('images/thumbnail_7.jpg'), require('images/thumbnail_8.jpg'),
	require('images/thumbnail_9.jpg'), require('images/thumbnail_10.jpg'), require('images/thumbnail_11.jpg'), require('images/thumbnail_12.jpg'),
]

class App extends Component {

	state = {
		id: '',
        nickname: '',
		unregisteredDialogOpen: false,
        alreadyConnectedDialogOpen: false,
        signUpDialogOpen: false,
		myInfo: null,
	}

	constructor() {
		super()
		this.socket = SocketIOClient(process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000')
		this.socket.on('unregistered', () => this.setState({ unregisteredDialogOpen: true }))
        this.socket.on('already_connected', () => this.setState({ alreadyConnectedDialogOpen: true }))
		this.socket.on('login_success', this.onLoginSuccess)
		this.socket.on('kicked', () => this.setState({ myInfo: null }))
	}

	componentDidMount = () => {
		//this.autoLoginIfCookieExist()
        window.onkeydown = e => {
			if(e.keyCode === 13) this.onEnterPress()
			else if(e.keyCode === 27) this.closeDialog()
		}
    }

    onEnterPress = () => {
		if(this.state.unregisteredDialogOpen) this.goToSignUp()
		else if(this.state.signUpDialogOpen) this.signUp()
		else if(this.state.alreadyConnectedDialogOpen) this.forceLogin()
		else this.login()
	}

	closeDialog = () => {
		this.setState({ unregisteredDialogOpen: false, signUpDialogOpen: false, alreadyConnectedDialogOpen: false })
	}

    componentWillUnmount() {
        window.onkeydown = null
    }
	
	autoLoginIfCookieExist = () => {
		const value = document.cookie.match('(^|;) ?kakaotalk_id=([^;]*)(;|$)')
  		const id = value? value[2] : null
		if(id) {
			this.setState({ id }, () => this.login())
		}
	}

    login = () => {
		this.socket.emit('login', this.state.id)
	}
	
	logout = () => {
		this.setState({ myInfo: null })
		this.socket.emit('logout')
		document.cookie = 'kakaotalk_id=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
	}

	goToSignUp = () => {
		this.setState({ unregisteredDialogOpen: false, signUpDialogOpen: true })
	}

    signUp = () => {
        this.setState({ signUpDialogOpen: false })
		this.socket.emit('register', this.state.id, this.state.nickname)
    }

    forceLogin = () => {
        this.setState({ alreadyConnectedDialogOpen: false })
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
					: <Login onLoginButtonClick={this.login} onIdTextChange={e => this.setState({ id: e.target.value })} id={this.state.id} />}
				
				{this.state.unregisteredDialogOpen && <Dialog
					okText='예' onOk={this.goToSignUp}
					cancelText='아니요' onCancel={this.closeDialog}>
						<div autoFocus>
							등록되지 않은 ID입니다.<br />이 아이디로 새로 가입할까요?
						</div>
				</Dialog>}
				
				{this.state.alreadyConnectedDialogOpen && <Dialog
					okText='접속' onOk={this.forceLogin}
					cancelText='취소' onCancel={this.closeDialog}>
						<div autoFocus>
							이미 접속 중인 ID입니다.<br />강제 로그아웃 시키고 여기서 접속할까요?
						</div>
				</Dialog>}
				
                {this.state.signUpDialogOpen && <Dialog
					okText='등록' onOk={this.signUp}
					cancelText='취소' onCancel={this.closeDialog}>
						<div>
							닉네임을 설정해주세요.
							<input onChange={e => this.setState({ nickname: e.target.value })} autoFocus/><br />
							사용하실 프로필 이미지를 선택해주세요!
							{thumbnailImages.map(thmb => <div style={{ background: `url${thmb} center no-repeat`}} />)}
						</div>
				</Dialog>}
				
            </Fragment>
        )
    }
}

export default App
