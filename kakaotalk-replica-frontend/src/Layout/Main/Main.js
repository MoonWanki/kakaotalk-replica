import React, { Component } from 'react'
import uuid from 'uuid/v1'
import { FriendList, RoomList, Room } from 'Layout'
import { Dialog, Button } from 'Components'
import './Main.scss'

// 실시간으로 유저 목록, 채팅방 목록을 받아 state를 업데이트합니다.
export default class Main extends Component {

    state = {
        friends: [],    // ★ 유저 목록
        rooms: [],      // ★ 채팅방 목록

        view: 0,
        friendSelectorOpen: false,
        myInfo: this.props.myInfo,
        logoutDialogOpen: false,

        roomOpened: null, // 채팅방 UI ON/OFF. 채팅방 UI를 띄울 땐 해당 채팅방 정보가 여기에도 있게 되며, 채팅방 UI(Room 컴포넌트)는 이걸 참조함.
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

    // ★ 유저 목록 UI 갱신
    onUserStatusUpdated = users => {
        this.setState({ friends: users.filter(u => u.id !== this.state.myInfo.id)})
    }

    // ★ 채팅방 목록 UI 갱신
    onRoomStatusUpdated = rooms => {
        this.setState({ rooms })

        // 채팅방 UI가 열려 있을 경우 
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

    // 채팅방 UI ON
    openRoom = room => {
        this.setState({ roomOpened: room })
        this.clearUnread(room) // 이때 채팅방의 메시지들을 모두 읽은 걸로 간주
    }

    // 채팅방 UI OFF
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

    // 로그아웃 요청
    logout = () => {
        this.setState({ logoutDialogOpen: false })
        this.socket.emit('logout')
    }
    
    render() {

        // 모든 안 읽은 메시지 수 계산
        let totalUnreadCount = 0
        const rooms = this.state.rooms.map(room => {
            const unreadCount = room.messages.filter(msg => msg.type!=='system' && msg.unreadIds.includes(this.props.myInfo.id)).length
            totalUnreadCount += unreadCount
            return { ...room, unreadCount }
        })

        return (
            <div className='main'>
                <div className={`home${this.state.roomOpened ? ' home-half' : ''}`}>
                    <div className='home-header'>
                        <div className='home-logo' />
                        <div className='home-nav'>
                            <div className='home-tab'>
                                <div title='유저' onClick={() => this.setState({ view: 0 })} className={`home-tab-item${this.state.view===0 ? ' home-tab-item-selected':''}`} style={{ backgroundImage: `url(${require('images/tab_icon_1.png')})`}} />
                                <div title='채팅' onClick={() => this.setState({ view: 1 })} className={`home-tab-item${this.state.view===1 ? ' home-tab-item-selected':''}`} style={{ backgroundImage: `url(${require('images/tab_icon_2.png')})`}} />
                                <div title='더보기' onClick={() => this.setState({ view: 2 })} className={`home-tab-item${this.state.view===2 ? ' home-tab-item-selected':''}`} style={{ backgroundImage: `url(${require('images/tab_icon_3.png')})`}} />
                            </div>
                            <div className='home-tab'>
                                <div title='로그아웃' onClick={() => this.setState({ logoutDialogOpen: true })} className='home-tab-item' style={{ backgroundImage: `url(${require('images/icon_exit.png')})`}} />
                            </div>
                        </div>
                    </div>

                    {totalUnreadCount > 0 && <div className='room-unread room-unread-global'>{totalUnreadCount}</div>}

                    {this.state.view===0 ? <FriendList myInfo={this.state.myInfo} friends={this.state.friends} />
                    : this.state.view===1 ? <RoomList myInfo={this.state.myInfo} friends={this.state.friends} rooms={rooms} onCreateRoom={this.createRoom} onRoomClick={this.openRoom} />
                    : this.state.view===2 ?
                        <div className='info-box'>
                            <div className='info-logo' />
                            <h2>KakaoTalk Replica</h2>
                            <h4>by Moon Wanki</h4>
                            <a href='https://github.com/MoonWanki/kakaotalk-replica' rel='noopener noreferrer' target='_blank'>GitHub</a>
                            <a href='https://www.octopusfantasy.com' rel='noopener noreferrer' target='_blank'>Octopus Fanatsy</a>
                        </div>
                    : null}
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
