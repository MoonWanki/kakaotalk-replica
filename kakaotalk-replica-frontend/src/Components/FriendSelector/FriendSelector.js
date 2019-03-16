import React, { Component } from 'react'
import { Button, Dialog, Thumbnail } from 'Components'
import produce from 'immer'
import './FriendSelector.scss'

export default class FriendSelector extends Component {

    state = {
        friends: this.props.friends.map(friend => ({ ...friend, isSelected: false }))
    }

    onSelectFinish = () => {
        this.props.onSelectFinish(this.state.friends.filter(friend => friend.isSelected).map(friend => ({ id: friend.id, nickname: friend.nickname })))
    }

    onItemClick = idx => {
        this.setState(produce(this.state, draft => {
            draft.friends[idx].isSelected = !draft.friends[idx].isSelected
        }))
    }

    render() {

        const selectedFriends = this.state.friends.filter(f => f.isSelected)
        return (
            <Dialog>
                <div className='dialog-content' autoFocus>
                    <div style={{ marginBottom: 8 }}>대화상대 초대&emsp;{selectedFriends.length>0 && <b>{selectedFriends.length}</b>}</div>
                    <div className='invitable-user-list'>
                        {this.state.friends.map((friend, idx) => 
                            <div key={idx} className='invitable-user' onClick={() => this.onItemClick(idx)}>
                                <div className='invitable-user-profile'>
                                    <Thumbnail type={friend.thumbnail} round />&emsp;{friend.nickname}
                                </div>
                                <div className='invitable-user-selected' style={{ background: friend.isSelected ? '#ffea2d' : null}}>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className='dialog-actions'>
                    <span style={{ margin: 4 }}><Button onClick={this.onSelectFinish} accent disabled={this.state.friends.every(f => !f.isSelected)}>확인</Button></span>
                    <span style={{ margin: 4 }}><Button onClick={this.props.onCancel}>취소</Button></span>
                </div>
            </Dialog>
        )
    }
}
