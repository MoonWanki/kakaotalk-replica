import React, { Component } from 'react'
import uuidv4 from 'uuid/v4'
import './Main.scss'
import RoomList from './RoomList'
import FriendList from './FriendList'
import Room from './Room'
import FriendSelector from 'Components/FriendSelector'

export default class Main extends Component {

    state = {
        view: 0,
        friends: [],
        rooms: [],
        roomOpened: null,
        friendSelectorOpen: false,
        myInfo: this.props.myInfo
    }

    socket = this.props.socket

    componentDidMount() {
        this.socket.on('user_status', this.onUserStatusUpdated)
        this.socket.on('room_status', this.onRoomStatusUpdated)
    }
    
    componentWillUnmount() {
        this.socket.off('user_status')
        this.socket.off('room_status')
    }

    onUserStatusUpdated = users => {
        this.setState({ friends: users.filter(u => u.id !== this.state.myInfo.id)})
    }

    onRoomStatusUpdated = rooms => {
        this.setState({ rooms })
        if(this.state.roomOpened) {
            const room = rooms.find(r => r.id === this.state.roomOpened.id)
            if(room) {
                this.setState({ roomOpened: room })
                this.clearUnread(room)
            }
        }
    }
    
    createRoom = invitedUsers => {
        const emptyRoom = {
            id: uuidv4(),
            members: [this.state.myInfo, ...invitedUsers],
            messages: [{ type: 'system', content: `${this.state.myInfo.nickname}님이 ${invitedUsers.map(u => u.nickname).join(', ')}님을 초대했습니다.`}],
        }
        this.setState({ friendSelectorOpen: false, roomOpened: emptyRoom })
    }

    openRoom = room => {
        this.setState({ roomOpened: room })
        this.clearUnread(room)
    }

    closeRoom = () => {
        this.setState({ roomOpened: null })
    }

    onCreateRoomButtonClick = () => {
        this.setState({ friendSelectorOpen: true, roomOpened: false })
    }

    clearUnread = room => {
        if(room.messages[room.messages.length-1].unreadIds.includes(this.state.myInfo.id)) {
            this.socket.emit('read_messages', room.id)
        }
    }
    
    render() {
        return (
            <div className='main'>
                <div className={`home${this.state.roomOpened ? ' home-half' : ''}`}>
                    <div className='home-header'>
                        <div className='home-logo' />
                        <div className='home-nav'>
                            <div className='home-tab'>
                                <div onClick={() => this.setState({ view: 0 })} className='home-tab-item' style={{ backgroundImage: `url(${require('images/tab_icon_1.png')})`}} />
                                <div onClick={() => this.setState({ view: 1 })} className='home-tab-item' style={{ backgroundImage: `url(${require('images/tab_icon_2.png')})`}} />
                                <div onClick={() => this.setState({ view: 2 })} className='home-tab-item' style={{ backgroundImage: `url(${require('images/tab_icon_3.png')})`}} />
                            </div>
                            <div className='home-menu'>
                                <div onClick={this.props.onLogout} className='home-menu-item' style={{ backgroundImage: `url(${require('images/tab_icon_1.png')})`}} />
                            </div>
                        </div>
                    </div>

                    {this.state.view===0 ? <FriendList myInfo={this.state.myInfo} friends={this.state.friends} />
                    : this.state.view===1 ? <RoomList rooms={this.state.rooms} onCreateRoomButtonClick={this.onCreateRoomButtonClick} onRoomDoubleClick={this.openRoom} />
                    : this.state.view===2 ? null : null}
                </div>

                {this.state.roomOpened && 
                    <div className='room-wrapper' >
                        <Room
                            socket={this.socket}
                            myInfo={this.state.myInfo}
                            friends={this.state.friends}
                            room={this.state.roomOpened}
                            onClose={this.closeRoom} />
                    </div>
                }

                {this.state.friendSelectorOpen && <FriendSelector friends={this.state.friends} onSelect={this.createRoom} onCancel={() => this.setState({ friendSelectorOpen: false })}/>}
            </div>
        )
    }
}
