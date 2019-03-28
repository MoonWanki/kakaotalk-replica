import React, { Component } from 'react'
import { Button, Dialog, FriendSelector, Thumbnail } from 'Components'
import Message from './Message'
import ss from 'socket.io-stream'
import uuid from 'uuid/v1'
import './Room.scss'

// props로 들어오는 하나의 채팅방 정보를 채팅방 UI로 보여줍니다.
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
                this.onSendButtonClick() // 쉬프트키 안 누른 채 엔터 키 입력시 메시지 전송
                e.preventDefault()
            }
        }
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
        // 최초 메시지일 경우
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

    // ★ 평문 메시지 전송
    onSendButtonClick = () => {
        if(this.state.text.trim().length) {
            this.sendMessage({
                type: 'text',
                content: this.state.text,
            })
            this.setState({ text: '' })
        }
    }

    // ★ 이미지 메시지 전송
    //    1. 이미지 파일을 서버에 업로드
    //    2. 업로드된 이미지 파일 URL을 image 타입 메시지로 전송
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
                    this.sendMessage({ type: 'image', content: filename })
                }
            })
            blobStream.pipe(stream)  
        }
        else {
            console.log('not image')
        }
    }

    render() {

        const unvisitedFriends = this.props.friends.filter(f => !this.props.room.members.find(m => m.id===f.id))
        const { room } = this.props
        return (
            <div className='room'>

                <div className='room-header'>
                    <Thumbnail type={100} round />&emsp;
                    <div className='room-header-content'>
                        <div className='room-header-content-row'>
                            <div className='room-title'><b>{room.members.map(m => m.nickname).join(', ')} <span style={{ color: 'gray' }}>({room.members.length})</span></b></div>
                            <div title='채팅방 나가기' className='room-menu-button room-leave-button' onClick={this.onLeaveButtonClick} />
                            <div title='닫기' className='room-menu-button room-close-button' onClick={this.props.onClose} />
                        </div>
                        <div className='room-header-content-row'>
                            <div title='대화상대 초대' className='room-menu-button room-invite-button' onClick={() => this.setState({ friendSelectorOpen: true })} style={{ width: room.messages.length > 1 ? 24 : 0 }} />
                        </div>
                    </div>
                </div>

                <div className='room-scroller'>
                    {room.messages.map((message, i) =>
                        <Message
                            key={i}
                            type={message.type}
                            content={message.content}
                            user={message.user}
                            unreadIds={message.unreadIds}
                            timestamp={message.timestamp}
                            isMine={message.type!=='system' ? (message.user.id === this.props.myInfo.id) : undefined} />)}
                </div>

                <div className='room-footer'>
                    <div className='room-form'>
                        <div className='room-textarea'>
                            <textarea onChange={e => this.setState({ text: e.target.value })} value={this.state.text} />
                        </div>
                        <Button accent onClick={this.onSendButtonClick} disabled={!this.state.text.trim().length}>전송</Button>
                    </div>
                    <div className='room-form-menu'>
                        <div title='사진 전송' className='image-upload-button'>
                            <input className='room-upload-input' type='file' onChange={this.sendImage} accept='image/*' />
                        </div>
                    </div> 
                </div>

                {this.state.friendSelectorOpen &&
                    <FriendSelector
                        friends={unvisitedFriends}
                        onSelectFinish={this.invite}
                        onCancel={() => this.setState({ friendSelectorOpen: false })}/>}
                
                {this.state.leaveDialogOpen && <Dialog>
					<div className='dialog-content' autoFocus>정말 채팅방을 나가시겠습니까?</div>
					<div className='dialog-actions'>
						<span style={{ margin: 4 }}><Button onClick={this.leave} accent>확인</Button></span>
						<span style={{ margin: 4 }}><Button onClick={() => this.setState({ leaveDialogOpen: false })}>취소</Button></span>
					</div>
				</Dialog>}
            </div>
        )
    }
}
