class Message {

    constructor(user, type, content, memberIds) {
        this.user = user
        this.type = type // 'text' | 'image' | 'system'
        this.timestamp = new Date()
        this.content = content // 'image' 타입일 경우 이미지파일 URL, 그밖의 경우 메시지 텍스트
        this.unreadIds = memberIds // 이 메시지를 안 읽은 자들의 id
    }

}

module.exports = Message
