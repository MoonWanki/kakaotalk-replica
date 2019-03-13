import React, { Component } from 'react'

export default class RoomList extends Component {
    render() {
        return (
            <div>
                <button onClick={this.props.onCreateRoomButtonClick}>+</button>
                {this.props.rooms.map((room, i) =>
                    <div key={i} onClick={() => this.props.onRoomClick(room)}>
                        {room.members.map(member => member.nickname).join(', ')}
                    </div>
                )}
            </div>
        )
    }
}
