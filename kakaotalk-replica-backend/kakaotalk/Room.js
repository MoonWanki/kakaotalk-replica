const Message = require('./Message')

class Room {

    constructor(id) {
        this.id = id
        this.members = new Array()
        this.messages = new Array()
    }

    join(user) {
        if(!user.findRoomById(this.id)) {
            user.roomsIn.push(this)
            this.members.push(user)
            this.notifyRoomStatusToMembers()
        }
    }

    leave(user) {
        this.members.splice(this.members.findIndex(m => m === user), 1)
        user.roomsIn.splice(user.roomsIn.findIndex(r => r.id === this.id), 1)
        this.addMessage(undefined, 'system', `${user.nickname}님이 방을 나갔습니다.`)
        console.log(`${user.nickname}님이 방 ${this.id.substring(0,8)}에서 나갔습니다.`)
        this.notifyRoomStatusToMembers()
    }

    addMessage(user, type, content) {
        const newMessage = new Message(user, type, content, this.members.map(member => member.id))
        this.messages.push(newMessage)
        this.notifyRoomStatusToMembers()
    }

    messagesReadBy(user) {
        for(let i=this.messages.length-1 ; i>=0 ; i--) {
            const idx = this.messages[i].unreadIds.findIndex(id => id===user.id)
            if(idx !== -1) {
                this.messages[i].unreadIds.splice(idx, 1)
            }
            else break
        }
        this.notifyRoomStatusToMembers()
    }

    notifyRoomStatusToMembers() {
        this.members.forEach(m => {
            if(m.isOnline) m.notifyRoomStatus()
        })
    }
}

module.exports = Room
