class Message {

    constructor(type, content, memberIds) {
        this.type = type
        this.time = new Date()
        this.content = content
        this.unreadIds = memberIds
    }

}

module.exports = Message
