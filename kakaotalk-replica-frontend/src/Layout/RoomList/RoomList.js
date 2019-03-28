import React, { Component } from 'react'
import { FriendSelector, Thumbnail } from 'Components'
import './RoomList.scss'

// props로 받은 채팅방정보 배열을 리스트 UI로 보여줍니다.
export default class RoomList extends Component {

    state = {
        isSearching: false,
        searchText: '',
        friendSelectorOpen: false,
    }

    onSearchTextChange = e => {
        const text = e.target.value
        if(text.length) this.setState({ isSearching: true, searchText: text })
        else this.setState({ isSearching: false, searchText: text })
    }

    onSelectFinish = users => {
        this.setState({ friendSelectorOpen: false })
        this.props.onCreateRoom(users)
    }

    render() {
        let { rooms } = this.props

        // 최근 메시지 순으로 정렬
        rooms.sort((a, b) => {
            if(a.messages.length && b.messages.length) {
                const timeA = a.messages[a.messages.length-1].timestamp
                const timeB = b.messages[b.messages.length-1].timestamp
                return timeA < timeB ? 1 : timeA > timeB ? -1 : 0
            }
            else return 0
        })

        // 채팅방 검색 중일 경우, 검색어로 rooms 배열 필터링
        if(this.state.isSearching) {
            rooms = rooms.filter(room => room.members.map(m => m.nickname).join().includes(this.state.searchText))
        }

        return (
            <div className='roomlist'>

                <div className='search'>
                    <div className='search-icon' />
                    <div className='search-textbox'>
                        <input id='search-friend' onChange={this.onSearchTextChange} placeholder='참여자 검색' value={this.state.searchText} />
                    </div>
                    <div className={`search-cancel-icon${this.state.isSearching ? ' search-cancel-icon-active' : ''}`} onClick={this.state.isSearching ? () => this.setState({ isSearching: false, searchText: '' }) : null} />
                </div>

                {rooms.map((room, i) => {
                    const userMessages = room.messages.filter(msg => msg.type!=='system')
                    const lastMessage = userMessages.length ? userMessages[userMessages.length-1] : undefined

                    return <div key={i} className='roomlist-item' onClick={() => this.props.onRoomClick(room)}>
                        <Thumbnail type={100} round />&emsp;
                        <div className='roomlist-item-content'>
                            <p><b>{room.members.map(m => m.nickname).join(', ')}&nbsp;&nbsp;<span style={{ color: '#bcbcbc' }}>{room.members.length}</span></b></p>
                            <p>{lastMessage ? lastMessage.type === 'text' ? lastMessage.content.length > 20 ? lastMessage.content.substring(0, 20)+'...' : lastMessage.content : '사진' : ''}</p>
                        </div>
                        <div className='roomlist-item-metadata'>
                            <span style={{ marginBottom: 6 }}>{lastMessage && new Date(lastMessage.timestamp).toLocaleTimeString() }</span>
                            {room.unreadCount > 0 && <div className='room-unread'>{room.unreadCount}</div>}
                        </div>
                    </div>
                })}

                <div title='새로운 채팅' className='create-room-button' onClick={() => this.setState({ friendSelectorOpen: true })} />

                {this.state.friendSelectorOpen && <FriendSelector friends={this.props.friends} onSelectFinish={this.onSelectFinish} onCancel={() => this.setState({ friendSelectorOpen: false })}/>}

            </div>
        )
    }
}
