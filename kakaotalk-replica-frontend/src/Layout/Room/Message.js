import React, { Component } from 'react'
import { Thumbnail } from 'Components'
import './Message.scss'

// props로 들어오는 메시지 정보를 알맞은 UI로 보여줍니다.
export default class Message extends Component {

    componentDidMount() {
        this.ref.scrollIntoView() // 메시지 생성 시 그 메시지로 스크롤 자동 이동
    }

    render() {
        const { type, content, user, timestamp, unreadIds, isMine } = this.props

        // system 타입일 경우
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
                            // text 타입일 경우
                            <div className='message-content' style={{ background: isMine ? '#ffea2d' : 'white'}}>
                                {content.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}
                            </div>
                            :
                            // image 타입일 경우 
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
