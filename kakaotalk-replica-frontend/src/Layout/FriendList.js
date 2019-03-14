import React, { Component } from 'react'

export default class FriendList extends Component {
    render() {
        return (
            <div>
                <h4>내 정보</h4>
                {this.props.myInfo.nickname}
                <h4>친구</h4>
                {this.props.friends.map((friend, i) =>
                    <div key={i}>
                        {friend.nickname}
                    </div>
                )}
            </div>
        )
    }
}
