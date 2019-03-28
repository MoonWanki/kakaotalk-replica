class User {

    constructor(socket, id, nickname, thumbnail) {
        this.socket = socket
        this.id = id
        this.nickname = nickname
        this.thumbnail = thumbnail
        this.isOnline = false

        this.roomsIn = []  // 이 유저가 참여 중인 모든 Room 인스턴스들
    }

    findRoomById(roomId) {
        return this.roomsIn.find(room => room.id === roomId)
    }

    // 모든 채팅 정보 전송 (채팅방목록 UI 업데이트 필요 시 호출)
    notifyRoomStatus() {
        const roomStatus = this.roomsIn.map(room => ({
            id: room.id,
            members: room.members.map(member => ({
                id: member.id,
                nickname: member.nickname,
                thumbnail: member.thumbnail,
            })),
            messages: room.messages.map(message => ({
                ...message,
                user: message.user ? {
                    id: message.user.id,
                    nickname: message.user.nickname,
                    thumbnail: message.user.thumbnail
                } : undefined,
            })),
        }))
        this.socket.emit('room_status', roomStatus)
    }
}

module.exports = User
