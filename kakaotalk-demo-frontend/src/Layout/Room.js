import React, { Component } from 'react'
import './Room.scss'

export default class Room extends Component {
    
    socket = this.props.socket

    state = {
        ...this.props.room,
        friends: this.props.room.members.filter(u => u.id !== this.props.myInfo.id),
        text: '',
    }

    sendInitialMessage() {

    }

    sendTextMessage = () => {

    }

    sendMessage = message => {
        if(this.state.messages.length) {
            this.socket.emit('send_message', this.state.id, message)
        }
        else {
            this.socket.emit('send_initial_message', this.state.id, message, this.state.friends.map(m => m.id))
        }
    }

    render() {
        return (
            <div className='room'>
                <div className='room-header'>
                    <div onClick={this.props.onClose}>닫기</div>
                </div>
                <div className='room-chat'>
                    챗
                </div>
                <div className='room-textfield'>
                    텍스트필드
                </div>
            </div>
        )
    }
}
