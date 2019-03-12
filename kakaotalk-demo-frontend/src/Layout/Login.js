import React, { Component, Fragment } from 'react'
import './Login.scss'
import Modal from 'Components/Modal'

export default class Login extends Component {

    state = {
        id: '',
        nickname: '',
		unregisteredModalOpen: false,
        alreadyConnectedModalOpen: false,
        registerModalOpen: false,
    }

    constructor(props) {
        super(props)
        props.socket.on('unregistered', () => this.setState({ unregisteredModalOpen: true }))
        props.socket.on('already_connected', () => this.setState({ alreadyConnectedModalOpen: true }))
    }

    login = () => {
        this.props.socket.emit('login', this.state.id)
    }

    register = () => {
        this.setState({ registerModalOpen: false })
        this.props.socket.emit('register', this.state.nickname)
    }

    forceLogin = () => {
        this.setState({ alreadyConnectedModalOpen: false })
        this.props.socket.emit('force_login')
    }
    
    render() {
        return (
            <Fragment>
                <div className='login'>
                    <div className='login-box'>
                        <input onChange={e => this.setState({ id: e.target.value})}></input>
                        <div className='login-button' onClick={this.login}>로그인</div>
                    </div>
                </div>
                {this.state.unregisteredModalOpen && <Modal onClose={() => this.setState({ unregisteredModalOpen: false })}>
                    <div className='modal-content'>등록되지 않은 ID입니다.<br />이 아이디로 새로 등록할까요?</div>
                    <div className='modal-actions'>
                        <div className='modal-button modal-button-ok' onClick={() => this.setState({ unregisteredModalOpen: false, registerModalOpen: true })}>확인</div>
                        <div className='modal-button modal-button-cancel' onClick={() => this.setState({ unregisteredModalOpen: false })}>취소</div>
                    </div>
                </Modal>}
                {this.state.alreadyConnectedModalOpen && <Modal onClose={() => this.setState({ alreadyConnectedModalOpen: false })}>
                    <div className='modal-content'>이미 접속 중인 ID입니다.<br />강제 로그아웃 시키고 여기서 접속할까요?</div>
                    <div className='modal-actions'>
                        <div className='modal-button modal-button-ok' onClick={this.forceLogin}>확인</div>
                        <div className='modal-button modal-button-cancel' onClick={() => this.setState({ alreadyConnectedModalOpen: false })}>취소</div>
                    </div>
                </Modal>}
                {this.state.registerModalOpen && <Modal onClose={() => this.setState({ registerModalOpen: false })}>
                    <div className='modal-content'>
                        닉네임을 설정해주세요.
                        <input onChange={e => this.setState({ nickname: e.target.value})}></input>
                        사용하실 프로필 이미지를 선택해주세요!
                    </div>
                    <div className='modal-actions'>
                        <div className='modal-button modal-button-ok' onClick={this.register}>확인</div>
                        <div className='modal-button modal-button-cancel' onClick={() => this.setState({ registerModalOpen: false })}>취소</div>
                    </div>
                </Modal>}
            </Fragment>
        )
    }
}
