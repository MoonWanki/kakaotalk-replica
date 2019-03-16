import React, { Component, Fragment } from 'react'
import { Thumbnail } from 'Components'
import './FriendList.scss'

export default class FriendList extends Component {

    state = {
        isSearching: false,
        searchText: '',
    }

    onSearchTextChange = e => {
        const text = e.target.value
        if(text.length) {
            this.setState({ isSearching: true, searchText: text })
        }
        else this.setState({ isSearching: false, searchText: text })
    }

    render() {
        let friends = this.props.friends
        friends.sort((a, b) => a.nickname < b.nickname ? -1 : a.nickname > b.nickname ? 1 : 0)
        if(this.state.isSearching) {
            friends = friends.filter(f => f.nickname.includes(this.state.searchText))
        }
        return (
            <div className='friendlist'>
                <div className='search'>
                    <div className='search-icon' />
                    <div className='search-textbox'>
                        <input id='search-friend' onChange={this.onSearchTextChange} placeholder='이름검색' value={this.state.searchText} />
                    </div>
                    <div className={`search-cancel-icon${this.state.isSearching ? ' search-cancel-icon-active' : ''}`} onClick={this.state.isSearching ? () => this.setState({ isSearching: false, searchText: '' }) : null} />
                </div>
                {!this.state.isSearching &&
                    <Fragment>
                        <div className='friendlist-subtitle'>내 프로필</div>
                        <div className='friendlist-profile'>
                            <Thumbnail type={this.props.myInfo.thumbnail} round big />&emsp;
                            <h4>{this.props.myInfo.nickname}</h4>
                        </div>
                        <div className='friendlist-hr' />
                    </Fragment>
                }

                <div className='friendlist-subtitle'>유저 &nbsp; {friends.length}</div>
                {friends.map((friend, i) =>
                    <div key={i} className='friendlist-profile'>
                        <Thumbnail type={friend.thumbnail} round />&emsp;
                        <h4>{friend.nickname}</h4>
                    </div>
                )}

            </div>
        )
    }
}
