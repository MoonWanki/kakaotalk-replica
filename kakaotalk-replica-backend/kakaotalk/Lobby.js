const Room = require('./Room')
const ss = require('socket.io-stream')
const fs = require('fs')
const path = require('path')

class Lobby {

    constructor() {
        this.users = new Array()
    }

    register(user) {
        this.users.push(user)
        this.users.forEach(user => { if(user.isOnline) this.notifyUserStatusTo(user) })
    }

    join(user) {
        console.log(`${user.nickname}님이 채팅에 접속하였습니다. UID: ${user.id} / SID: ${user.socket.id}`)
        user.isOnline = true

        user.socket.on('invite', (roomId, invitedUsers) => this.invite(roomId, user, invitedUsers))
        user.socket.on('leave_room', roomId => this.onLeaveRoom(user, roomId))
        user.socket.on('send_initial_message', (roomId, message, invitedUsers) => this.onSendInitialMessage(user, roomId, message, invitedUsers))
        user.socket.on('send_message', (roomId, message) => this.onSendMessage(user, roomId, message))
        user.socket.on('read_messages', roomId => this.onReadMessages(user, roomId))
        user.socket.on('disconnect', reason => this.leave(user))
        user.socket.on('logout', () => this.leave(user))
        ss(user.socket).on('send_image', this.onSendImage)

        user.socket.emit('login_success', { id: user.id, nickname: user.nickname, thumbnail: user.thumbnail })
        user.notifyRoomStatus()
        this.notifyUserStatusTo(user)                                                                                                                                                                                                                                                                                                                                 
    }

    leave(user) {
        user.isOnline = false
        
        user.socket.removeAllListeners('invite')
        user.socket.removeAllListeners('leave_room')
        user.socket.removeAllListeners('send_initial_message')
        user.socket.removeAllListeners('send_message')
        user.socket.removeAllListeners('read_messages')
        user.socket.removeAllListeners('disconnect')
        user.socket.removeAllListeners('logout')
        ss(user.socket).off('send_image', this.onSendImage)

        user.socket.emit('logout_success')
        user.socket = null
        console.log(`${user.nickname}님이 채팅을 종료하였습니다.`)
    }

    kick(user) {
        user.socket.emit('kicked')
        this.leave(user)
    }

    invite(roomId, inviter, invitedUsers) {
        const room = inviter.findRoomById(roomId)
        invitedUsers.forEach(u => {
            const user = this.findUserById(u.id)
            room.join(user)
        })
        room.addMessage(undefined, 'system', `${inviter.nickname}님이 ${invitedUsers.map(u => u.nickname).join(', ')}님을 초대했습니다.`)
        console.log(`${inviter.nickname}님이 방 ${roomId.substring(0,8)}에 ${invitedUsers.map(u => u.nickname).join(', ')}님을 초대했습니다.`)
    }

    onSendMessage(user, roomId, message) {
        const room = user.findRoomById(roomId)
        room.addMessage(user, message.type, message.content)
    }

    onSendImage(stream, data) {
        var filename = path.join(__dirname, 'res', data.filename)
        stream.pipe(fs.createWriteStream(filename))
    }

    onSendInitialMessage(owner, roomId, message, invitedUsers) {
        const newRoom = new Room(roomId)
        console.log(`${owner.nickname}님이 새로운 방 ${roomId.substring(0,8)}을 만들었습니다.`)
        newRoom.join(owner)
        this.invite(roomId, owner, invitedUsers)
        this.onSendMessage(owner, roomId, message)
    }

    onReadMessages(user, roomId) {
        const room = user.findRoomById(roomId)
        room.messagesReadBy(user)
    }

    onLeaveRoom(user, roomId) {
        let room = user.findRoomById(roomId)
        room.leave(user)
        if(room.members.length===0) {
            console.log(`모든 멤버가 나간 방 ${room.id.substring(0,8)}을 제거합니다.`)
            room = null // destroy room
        }
        user.notifyRoomStatus()
    }

    notifyUserStatusTo(user) {
        const userStatus = this.users.map(user => ({
            id: user.id,
            nickname: user.nickname,
            thumbnail: user.thumbnail,
        }))
        user.socket.emit('user_status', userStatus)
    }
    
    findUserById(id) {
        return this.users.find(user => id === user.id)
    }
}

module.exports = Lobby
