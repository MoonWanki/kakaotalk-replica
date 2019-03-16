import React, { Component } from 'react'
import { Dialog, Button } from 'Components'
import './Login.scss'

export default class Login extends Component {

	socket = this.props.socket

    state = {
		id: '',
        nickname: '',
		unregisteredDialogOpen: false,
        alreadyConnectedDialogOpen: false,
		signUpDialogOpen: false,
		selectedThumbnail: -1,
		autoLoginEnabled: false,
	}
    
	componentDidMount = () => {
		this.socket.on('unregistered', this.onUnregistered)
        this.socket.on('already_connected',  this.onAlreadyConnected)
		this.autoLoginIfCookieExist()
        window.onkeydown = e => {
			if(e.keyCode === 13) this.onEnterPress()
			else if(e.keyCode === 27) this.closeDialog()
		}
	}
	
	componentWillUnmount() {
		window.onkeydown = null

        this.socket.off('unregistered')
        this.socket.off('already_connected')
    }

    onEnterPress = () => {
		if(this.state.unregisteredDialogOpen) this.goToSignUp()
		else if(this.state.signUpDialogOpen) this.signUp()
		else if(this.state.alreadyConnectedDialogOpen) this.forceLogin()
		else this.login()
	}

	closeDialog = () => {
		this.idInput.focus()
		this.setState({ unregisteredDialogOpen: false, signUpDialogOpen: false, alreadyConnectedDialogOpen: false, nickname: '', selectedThumbnail: -1 })
	}
	
	autoLoginIfCookieExist = () => {
		const value = document.cookie.match('(^|;) ?kakaotalk_id=([^;]*)(;|$)')
  		const id = value? value[2] : null
		if(id) {
			this.setState({ id }, () => this.login())
		}
	}

    login = () => {
		if(this.state.id.length) {
			this.socket.emit('login', this.state.id)
			if(this.state.autoLoginEnabled) document.cookie = `kakaotalk_id=${this.state.id}`
		}
	}

	onUnregistered = () => {
		document.cookie = 'kakaotalk_id=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
		this.idInput.blur()
		this.setState({ unregisteredDialogOpen: true })
	}

	goToSignUp = () => {
		this.setState({ unregisteredDialogOpen: false, signUpDialogOpen: true })
	}

    signUp = () => {
		if(this.state.autoLoginEnabled) document.cookie = `kakaotalk_id=${this.state.id}`
        this.setState({ signUpDialogOpen: false })
		this.socket.emit('register', this.state.id, this.state.nickname, this.state.selectedThumbnail)
    }

	onAlreadyConnected = () => {
		this.idInput.blur()
		this.setState({ alreadyConnectedDialogOpen: true })
	}

	forceLogin = () => {
        this.setState({ alreadyConnectedDialogOpen: false })
        this.socket.emit('force_login')
	}
    
    render() {
        return (
            <div className='login'>
                <div className='login-box'>

					<div className='login-logo' />

					<div className='login-form'>
						<div className="login-textbox">
							<input placeholder='아이디' id="id" onChange={e => this.setState({ id: e.target.value })} value={this.state.id} ref={ref => { this.idInput = ref }}></input>
						</div>
						<div className={`login-button${this.state.id.length ? ' login-button-active' : ''}`} onClick={this.login}><p style={{ marginTop: 10 }}>로그인</p></div>
						<div className="login-autologin">
							<input type="checkbox" value={this.state.autoLoginEnabled} onChange={e => this.setState({ autoLoginEnabled: e.target.value })} />&nbsp;<span style={{ color: '#7c796f'}}>자동로그인</span>
						</div>
						
					</div>
                
				</div>

                {this.state.unregisteredDialogOpen && <Dialog>
					<div className='dialog-content' autoFocus>등록되지 않은 ID입니다.<br />이 아이디로 새로 가입할까요?</div>
					<div className='dialog-actions'>
						<span style={{ margin: 4 }}><Button onClick={this.goToSignUp} accent>예</Button></span>
						<span style={{ margin: 4 }}><Button onClick={this.closeDialog}>아니요</Button></span>
					</div>
				</Dialog>}
				
				{this.state.alreadyConnectedDialogOpen && <Dialog>
					<div className='dialog-content' autoFocus>이미 접속 중인 ID입니다.<br />강제 로그아웃 시키고 여기서 접속할까요?</div>
					<div className='dialog-actions'>
						<span style={{ margin: 4 }}><Button onClick={this.forceLogin} accent>접속</Button></span>
						<span style={{ margin: 4 }}><Button onClick={this.closeDialog}>취소</Button></span>
					</div>
				</Dialog>}
				
                {this.state.signUpDialogOpen && <Dialog>
						<div className='dialog-content' autoFocus>
							이름을 입력해주세요.
							<div className="nickname-textbox">
								<input placeholder='이름' id="nickname" onChange={e => this.setState({ nickname: e.target.value })} />
							</div>
							<br />
							프로필 이미지를 선택해주세요.
							<table>
								<tbody>
									<tr>{[0,1,2,3].map((n, i) => <td key={i} className='register-thumbnail' onClick={() => this.setState({ selectedThumbnail: n })} style={{ backgroundImage: `url(${require(`images/thumbnail_${n}.jpg`)})`}}>{this.state.selectedThumbnail===n &&<div className='register-thumbnail-selected' />}</td>)}</tr>
									<tr>{[4,5,6,7].map((n, i) => <td key={i} className='register-thumbnail' onClick={() => this.setState({ selectedThumbnail: n })} style={{ backgroundImage: `url(${require(`images/thumbnail_${n}.jpg`)})`}}>{this.state.selectedThumbnail===n &&<div className='register-thumbnail-selected' />}</td>)}</tr>
									<tr>{[8,9,10,11].map((n, i) => <td key={i} className='register-thumbnail' onClick={() => this.setState({ selectedThumbnail: n })} style={{ backgroundImage: `url(${require(`images/thumbnail_${n}.jpg`)})`}}>{this.state.selectedThumbnail===n &&<div className='register-thumbnail-selected' />}</td>)}</tr>
								</tbody>
							</table>
						</div>
						<div className='dialog-actions'>
							<span style={{ margin: 4 }}><Button onClick={this.signUp} accent disabled={!this.state.nickname.length || this.state.selectedThumbnail===-1}>등록</Button></span>
							<span style={{ margin: 4 }}><Button onClick={this.closeDialog}>취소</Button></span>
						</div>
				</Dialog>}

				<div className='login-ryan' />
            </div>
        )
    }
}
