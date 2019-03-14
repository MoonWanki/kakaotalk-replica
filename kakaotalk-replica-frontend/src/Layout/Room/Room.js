import React, { Component } from 'react'
import { Button, Dialog, FriendSelector } from 'Components'
import ss from 'socket.io-stream'
import uuid from 'uuid/v1'
import './Room.scss'

export default class Room extends Component {
    
    socket = this.props.socket

    state = {
        text: '',
        friendSelectorOpen: false,
        leaveDialogOpen: false,
    }

    componentDidMount() {
        window.onkeydown = e => {
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

    sendImage = e => {
        const file = e.target.files[0]
        if(file && file.type.includes('image')) {
            const extension = file.name.slice(file.name.lastIndexOf('.'))
            const stream = ss.createStream()
            const filename = uuid() + extension
            ss(this.socket).emit('send_image', stream, { filename })
            const blobStream = ss.createBlobReadStream(file)
            let sizeUploaded = 0
            blobStream.on('data', chunk => {
                sizeUploaded += chunk.length
                if(sizeUploaded === file.size) {
                    this.sendMessage({
                        type: 'image',
                        content: filename,
                    })
                }
            })
            blobStream.pipe(stream)  
        }
        else {
            console.log('not image')
        }
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
                if(message.user.id === this.props.myInfo.id) { // my message
                    return (
                        <div key={i} className='room-chat-message'>
                            {message.type === 'text'
                                ? message.content
                                : <img width={240} src={`${process.env.REACT_APP_BACKEND_URL}/kakaotalk/res/${message.content}`} alt='image_message' />}
                        </div>
                    )
                }
                else { // other's message
                    return (
                        <div key={i} className='room-chat-message'>
                            {message.type === 'text'
                                ? message.content
                                : <img width={240} src={`${process.env.REACT_APP_BACKEND_URL}/kakaotalk/res/${message.content}`} alt='image_message' />}
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
                    <input type='file' onChange={this.sendImage} accept='image/*' />사진보내기
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
