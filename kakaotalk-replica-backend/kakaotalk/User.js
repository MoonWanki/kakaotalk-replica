class User {

    constructor(socket, id, nickname) {
        this.socket = socket
        this.id = id
        this.nickname = nickname
        this.isOnline = false

        this.roomsIn = new Array()
    }

    findRoomById(roomId) {
        return this.roomsIn.find(room => room.id === roomId)
    }

    notifyRoomStatus() {
        const roomStatus = this.roomsIn.map(room => ({
            id: room.id,
            members: room.members.map(member => ({
                id: member.id,
                nickname: member.nickname,
            })),
            messages: room.messages.map(message => ({
                ...message,
                user: message.user ? { id: message.user.id, nickname: message.user.nickname } : undefined,
            })),
        }))
        this.socket.emit('room_status', roomStatus)
    }
}

module.exports = User