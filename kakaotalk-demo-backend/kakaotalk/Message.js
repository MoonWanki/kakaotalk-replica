class Message {

    constructor(user, type, content, memberIds) {
        this.user = user
        this.type = type
        this.timestamp = new Date()
        this.content = content
        this.unreadIds = memberIds
    }

}

module.exports = Message
