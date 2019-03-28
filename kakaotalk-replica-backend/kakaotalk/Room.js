const Message = require('./Message')

class Room {

    constructor(id) {
        this.id = id
        this.members = []
        this.messages = []
    }

    // 유저를 이 방의 멤버에 추가
    join(user) {
        if(!user.findRoomById(this.id)) {
            this.members.push(user) // 방에 유저 참조 추가
            user.roomsIn.push(this) // 유저에 방 참조 추가
            this.notifyRoomStatusToMembers()
        }
    }

    // 유저를 이 방의 멤버에서 제거
    leave(user) {
        this.members.splice(this.members.findIndex(m => m === user), 1) // 방에서 유저 참조 제거
        user.roomsIn.splice(user.roomsIn.findIndex(r => r.id === this.id), 1) // 유저에서 방 참조 제거
        this.addMessage(undefined, 'system', `${user.nickname}님이 방을 나갔습니다.`)
        console.log(`${user.nickname}님이 방 ${this.id.substring(0,8)}에서 나갔습니다.`)
        this.notifyRoomStatusToMembers()
    }

    // 메시지 추가
    addMessage(user, type, content) {
        const newMessage = new Message(user, type, content, this.members.map(member => member.id))
        this.messages.push(newMessage)
        this.notifyRoomStatusToMembers()
    }

    // 메시지 읽음
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

    // 멤버 전원 UI 업데이트 (유저 초대, 유저 나감, 메시지 추가, 메시지 읽음)
    notifyRoomStatusToMembers() {
        this.members.forEach(m => {
            if(m.isOnline) m.notifyRoomStatus()
        })
    }
}

module.exports = Room
