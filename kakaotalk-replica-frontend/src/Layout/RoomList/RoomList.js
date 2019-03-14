import React, { Component } from 'react'
import './RoomList.scss'

export default class RoomList extends Component {

    renderRoomItem = () => {
        return this.props.rooms.map((room, i) => {
            const userMessages = room.messages.filter(msg => msg.type!=='system')
            const lastMessage = userMessages[userMessages.length - 1]
            return <div key={i} onDoubleClick={() => this.props.onRoomDoubleClick(room)}>
                {room.members.map(member => member.nickname).join(', ')}
                <br/>
                {lastMessage && (lastMessage.type==='text' ? lastMessage.content : '사진')}
            </div>
        })
    }

    render() {
        return (
            <div>
                <button onClick={this.props.onCreateRoomButtonClick}>+</button>
                {this.renderRoomItem()}
            </div>
        )
    }
}
