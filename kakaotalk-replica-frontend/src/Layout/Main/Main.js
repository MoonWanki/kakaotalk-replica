import React, { Component } from 'react'
import uuid from 'uuid/v1'
import { FriendList, RoomList, Room } from 'Layout'
import { Dialog, Button } from 'Components'
import './Main.scss'

export default class Main extends Component {

    state = {
        view: 0,
        friends: [],
        rooms: [],
        roomOpened: null,
        friendSelectorOpen: false,
        myInfo: this.props.myInfo,
        logoutDialogOpen: false,
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
            id: uuid(),
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
        this.setState({ friendSelectorOpen: true })
    }

    clearUnread = room => {
        if(room.messages.length > 1 && room.messages[room.messages.length-1].unreadIds.includes(this.state.myInfo.id)) {
            this.socket.emit('read_messages', room.id)
        }
    }

    logout = () => {
        this.setState({ logoutDialogOpen: false })
        this.socket.emit('logout')
        document.cookie = 'kakaotalk_id=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    }
    
    render() {
        return (
            <div className='main'>
                <div className={`home${this.state.roomOpened ? ' home-half' : ''}`}>
                    <div className='home-header'>
                        <div className='home-logo' />
                        <div className='home-nav'>
                            <div className='home-tab'>
                                <div title='유저' onClick={() => this.setState({ view: 0 })} className='home-tab-item' style={{ backgroundImage: `url(${require('images/tab_icon_1.png')})`}} />
                                <div title='채팅' onClick={() => this.setState({ view: 1 })} className='home-tab-item' style={{ backgroundImage: `url(${require('images/tab_icon_2.png')})`}} />
                                <div title='더보기' onClick={() => this.setState({ view: 2 })} className='home-tab-item' style={{ backgroundImage: `url(${require('images/tab_icon_3.png')})`}} />
                            </div>
                            <div className='home-menu'>
                                <div title='로그아웃' onClick={() => this.setState({ logoutDialogOpen: true })} className='home-menu-item' style={{ backgroundImage: `url(${require('images/icon_exit.png')})`}} />
                            </div>
                        </div>
                    </div>

                    {this.state.view===0 ? <FriendList myInfo={this.state.myInfo} friends={this.state.friends} />
                    : this.state.view===1 ? <RoomList friends={this.state.friends} rooms={this.state.rooms} onCreateRoom={this.createRoom} onRoomClick={this.openRoom} />
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

                {/* {this.state.friendSelectorOpen && <FriendSelector friends={this.state.friends} onSelect={this.createRoom} onCancel={() => this.setState({ friendSelectorOpen: false })}/>} */}
            
                {this.state.logoutDialogOpen && <Dialog>
                    <div className='dialog-content' autoFocus>정말 로그아웃하시겠습니까?</div>
					<div className='dialog-actions'>
						<span style={{ margin: 4 }}><Button onClick={this.logout} accent>확인</Button></span>
						<span style={{ margin: 4 }}><Button onClick={() => this.setState({ logoutDialogOpen: false })}>취소</Button></span>
					</div>
				</Dialog>}
            </div>
        )
    }
}
