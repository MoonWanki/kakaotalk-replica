import React, { Component } from 'react'
import { Thumbnail } from 'Components'
import './Message.scss'

export default class Message extends Component {

    componentDidMount() {
        this.ref.scrollIntoView()
    }

    render() {
        const { type, content, user, timestamp, unreadIds, isMine } = this.props

        if(type === 'system') {
            return (
                <div className='system-message' ref={ref => { this.ref = ref }}>
                    <p>{content}</p>
                </div>
            )
        }
        else {
            return (
                <div className='message' style={{ flexDirection: isMine ? 'row-reverse' : 'row' }} ref={ref => { this.ref = ref }}>
                    <Thumbnail type={user.thumbnail} round />
                    &emsp;
                    <div className='message-body' style={{ alignItems: isMine ? 'flex-end' : 'flex-start' }}>
                        <div>{user.nickname}</div>
                        <div className='message-info' style={{ flexDirection: isMine ? 'row-reverse' : 'row', alignItems: 'flex-end' }}>
                            {type === 'text' ?
                            <div className='message-content' style={{ background: isMine ? '#ffea2d' : 'white'}}>
                                {content}
                            </div>
                            :
                            <img src={`${process.env.REACT_APP_BACKEND_URL}/kakaotalk/res/${content}`} alt='image_message' />}
                            &nbsp;
                            <div className='message-metadata' style={{ alignItems: isMine ? 'flex-end' : 'flex-start' }}>
                                <div className='message-timestamp'>{new Date(timestamp).toLocaleTimeString()}</div>
                                <div className='message-unread'>{unreadIds.length > 0 && unreadIds.length}</div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            )
        }
    }
}
