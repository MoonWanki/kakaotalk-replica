import React, { Component } from 'react'
import Button from 'Components/Button'
import FriendSelector from 'Components/FriendSelector'
import Dialog from 'Components/Dialog'
import './Room.scss'

export default class Room extends Component {
    
    socket = this.props.socket

    state = {
        text: '',
        friendSelectorOpen: false,
        leaveDialogOpen: false,
    }

    componentDidMount() {
        window.onkeypress = e => {
            if(e.keyCode === 13 && !e.shiftKey) {
                this.onSendButtonClick()
                e.preventDefault()
            }
        }
    }

    onSendButtonClick = () => {
        this.sendMessage({
            type: 'text',
            content: this.state.text,
        })
        this.setState({ text: '' })
    }

    componentWillUnmount() {
        window.onkeydown = null
    }

    sendMessage = message => {
        const { socket, myInfo, room } = this.props
        const isExistentRoom = room.messages.length > 1
        if(isExistentRoom) {
            socket.emit('send_message', room.id, message)
        }
        else {
            socket.emit('send_initial_message', room.id, message, room.members.filter(u => u.id !== myInfo.id))
        }
    }

    invite = invitedUsers => {
        this.setState({ friendSelectorOpen: false })
        this.socket.emit('invite', this.props.room.id, invitedUsers)
    }

    onLeaveButtonClick = () => {
        const isExistentRoom = this.props.room.messages.length > 1
        if(isExistentRoom) this.setState({ leaveDialogOpen: true })
        else this.props.onClose()
    }

    leave = () => {
        this.setState({ leaveDialogOpen: false })
        this.props.onClose()
        this.socket.emit('leave_room', this.props.room.id)
    }

    renderMessages = () => {
        return this.props.room.messages.map((message, i) => {
            if(message.type === 'system') {
                return (
                    <div key={i} className='room-chat-message'>
                        {message.content}
                    </div>
                )
            }
            else {
                if(message.user.id === this.props.myInfo.id) {
                    return (
                        <div key={i} className='room-chat-message'>
                            {message.content}
                        </div>
                    )
                }
                else {
                    return (
                        <div key={i} className='room-chat-message'>
                            {message.content}
                        </div>
                    )
                }   
            }
        })
    }

    render() {
        return (
            <div className='room'>
                <div className='room-header'>
                    <div onClick={() => this.setState({ friendSelectorOpen: true })}>친구 초대</div>
                    <div onClick={this.props.onClose}>닫기</div>
                    <div onClick={this.onLeaveButtonClick}>채팅방 나가기</div>
                </div>

                <hr />

                <div className='room-chat'>
                    {this.renderMessages()}
                </div>

                <hr />

                <div className='room-textfield'>
                    <textarea onChange={e => this.setState({ text: e.target.value })} value={this.state.text} />
                    <Button accent onClick={this.onSendButtonClick} disabled={!this.state.text.length}>전송</Button>
                </div>

                {this.state.friendSelectorOpen && <FriendSelector friends={this.props.friends} onSelect={this.invite} onCancel={() => this.setState({ friendSelectorOpen: false })}/>}
                
                {this.state.leaveDialogOpen && <Dialog
					okText='확인' onOk={this.leave}
					cancelText='취소' onCancel={() => this.setState({ leaveDialogOpen: false })}>
						<div>
							정말 채팅방에서 나가시겠습니까?
						</div>
				</Dialog>}
            </div>
        )
    }
}
