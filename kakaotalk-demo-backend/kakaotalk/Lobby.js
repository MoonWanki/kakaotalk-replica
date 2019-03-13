const Room = require('./Room')

class Lobby {

    constructor() {
        this.users = new Array()
    }

    register(user) {
        this.users.push(user)
        this.users.forEach(user => this.notifyUserStatusTo(user))
    }

    join(user) {
        console.log(`${user.nickname}님이 채팅에 접속하였습니다. sid: ${user.socket.id}`)
        user.isOnline = true

        user.socket.on('invite', (roomId, invitedUsers) => this.invite(roomId, user, invitedUsers))
        user.socket.on('leave_room', roomId => this.onUserLeaveRoom(user, roomId))
        user.socket.on('send_initial_message', (roomId, message, invitedUsers) => this.onSendInitialMessage(user, roomId, message, invitedUsers))
        user.socket.on('send_message', (roomId, message) => this.onSendMessage(user, roomId, message))
        user.socket.on('read_messages', roomId => this.onReadMessages(user, roomId))
        user.socket.on('disconnect', reason => this.leave(user))
        user.socket.on('logout', () => this.leave(user))

        user.socket.emit('login_success', { id: user.id, nickname: user.nickname })
        user.notifyRoomStatus()
        this.notifyUserStatusTo(user)                                                                                                                                                                                                                                                                                                                                 
    }

    leave(user) {
        user.isOnline = false
        user.socket.removeAllListeners('create_room')
        user.socket.removeAllListeners('leave_room')
        user.socket.removeAllListeners('invite')
        user.socket.removeAllListeners('disconnect')
        user.socket.removeAllListeners('logout')
        user.socket = null
        console.log(`${user.nickname}님이 채팅을 종료하였습니다.`)
    }

    kick(user) {
        user.socket.emit('kicked')
        this.leave(user)
    }

    createRoom(owner, roomId, userIds) {
        const newRoom = new Room(roomId)
        newRoom.join(owner)
        this.invite(newRoom.id, owner, userIds)
    }

    invite(roomId, inviter, invitedUsers) {
        const room = inviter.findRoomById(roomId)
        invitedUsers.forEach(u => {
            const user = this.findUserById(u.id)
            room.join(user)
        })
        room.addMessage('system', `${invitedUsers.map(u => u.nickname).join(', ')}님을 초대했습니다.`)
        console.log(`${invitedUsers.map(u => u.nickname).join(', ')}님을 초대했습니다.`)
    }

    onSendMessage(user, roomId, message) {
        const room = user.findRoomById(roomId)
        room.addMessage(message.type, message.content)
    }

    onSendInitialMessage(owner, roomId, message, invitedUsers) {
        const newRoom = new Room(roomId)
        newRoom.join(owner)
        this.invite(roomId, owner, invitedUsers)
        this.onSendMessage(owner, roomId, message)
    }

    onReadMessages(user, roomId) {
        const room = user.findRoomById(roomId)
        room.messagesReadBy(user)
    }

    onUserLeaveRoom(user, roomId) {
        const room = user.findRoomById(roomId)
        room.leave(user)
        if(room.members.length) room = null // destroy room
        user.notifyRoomStatus()
    }

    notifyUserStatusTo(user) {
        const userStatus = this.users.map(user => ({
            id: user.id,
            nickname: user.nickname,
        }))
        user.socket.emit('user_status', userStatus)
    }
    
    findUserById(id) {
        return this.users.find(user => id === user.id)
    }
}

module.exports = Lobby
