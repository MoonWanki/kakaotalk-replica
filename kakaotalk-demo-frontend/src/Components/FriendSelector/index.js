import React, { Component } from 'react'
import Button from 'Components/Button'
import produce from 'immer'
import './index.scss'

export default class FriendSelector extends Component {

    state = {
        friends: this.props.friends.map(friend => ({ ...friend, isSelected: false }))
    }

    onSelect = () => {
        this.props.onSelect(this.state.friends.filter(friend => friend.isSelected).map(friend => ({ id: friend.id, nickname: friend.nickname })))
    }

    onItemClick = idx => {
        this.setState(produce(this.state, draft => {
            draft.friends[idx].isSelected = !draft.friends[idx].isSelected
        }))
    }

    render() {
        return (
            <div className='selector'>
                <div className='selector-inner'>
                    <div className='selector-content'>
                        {this.state.friends.map((friend, idx) => 
                            <div key={idx} onClick={() => this.onItemClick(idx)}>
                                {friend.nickname} {friend.isSelected && '(선택됨)'}
                            </div>
                        )}
                    </div>
                    <div className='selector-actions'>
                        <Button onClick={this.onSelect} accent>확인</Button>
                        <Button onClick={this.props.onCancel}>취소</Button>
                    </div>
                </div>
            </div>
        )
    }
}
