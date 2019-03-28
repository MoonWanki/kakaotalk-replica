const Room = require('./Room')
const ss = require('socket.io-stream')
const fs = require('fs')
const path = require('path')

class Lobby {

    constructor() {
        this.users = []
    }

    // 새 User 인스턴스 추가
    register(user) {
        this.users.push(user)
        this.users.forEach(user => { if(user.isOnline) this.notifyUserStatusTo(user) })
    }

    // 로그인 한 User 인스턴스 활성화
    join(user) {
        console.log(`${user.nickname}님이 채팅에 접속하였습니다. UID: ${user.id} / SID: ${user.socket.id}`)
        user.isOnline = true

        // 소켓에 이벤트 등록
        user.socket.on('invite',                (roomId, invitedUsers) => this.invite(roomId, user, invitedUsers))
        user.socket.on('leave_room',            (roomId) => this.onLeaveRoom(user, roomId))
        user.socket.on('send_initial_message',  (roomId, message, invitedUsers) => this.onSendInitialMessage(user, roomId, message, invitedUsers))
        user.socket.on('send_message',          (roomId, message) => this.onSendMessage(user, roomId, message))
        user.socket.on('read_messages',         (roomId) => this.onReadMessages(user, roomId))
        user.socket.on('disconnect',            (reason) => this.leave(user))
        user.socket.on('logout',                () => this.leave(user))
        ss(user.socket).on('send_image',        this.onSendImage)

        // 클라이언트에 로그인 성공 응답
        user.socket.emit('login_success',       { id: user.id, nickname: user.nickname, thumbnail: user.thumbnail })

        user.notifyRoomStatus()
        this.notifyUserStatusTo(user)                                                                                                                                                                                                                                                                                                                                 
    }

    // 로그아웃 처리
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
        user.socket = null // 소켓 제거
        console.log(`${user.nickname}님이 채팅을 종료하였습니다.`)
    }

    // 강제 로그아웃
    kick(user) {
        user.socket.emit('kicked')
        this.leave(user)
    }

    // 채팅방에 유저 초대
    invite(roomId, inviter, invitedUsers) {
        const room = inviter.findRoomById(roomId)
        invitedUsers.forEach(u => {
            const user = this.findUserById(u.id)
            room.join(user)
        })
        room.addMessage(undefined, 'system', `${inviter.nickname}님이 ${invitedUsers.map(u => u.nickname).join(', ')}님을 초대했습니다.`)
        console.log(`${inviter.nickname}님이 방 ${roomId.substring(0,8)}에 ${invitedUsers.map(u => u.nickname).join(', ')}님을 초대했습니다.`)
    }

    // 채팅방에 메시지 추가
    onSendMessage(user, roomId, message) {
        const room = user.findRoomById(roomId)
        room.addMessage(user, message.type, message.content)
    }

    // 첫 메시지 추가: 채팅방 생성 + 유저 초대 + 메시지 추가
    onSendInitialMessage(owner, roomId, message, invitedUsers) {
        const newRoom = new Room(roomId)
        console.log(`${owner.nickname}님이 새로운 방 ${roomId.substring(0,8)}을 만들었습니다.`)
        newRoom.join(owner)
        this.invite(roomId, owner, invitedUsers)
        this.onSendMessage(owner, roomId, message)
    }
    
    // 이미지파일 수신
    onSendImage(stream, data) {
        var filename = path.join(__dirname, 'res', data.filename)
        stream.pipe(fs.createWriteStream(filename))
    }

    // 메시지 확인: 안 읽은 유저 숫자 감소
    onReadMessages(user, roomId) {
        const room = user.findRoomById(roomId)
        room.messagesReadBy(user)
    }

    // 채팅방에서 유저 나감: 해당 Room에 대한 참조를 User에서 제거
    onLeaveRoom(user, roomId) {
        let room = user.findRoomById(roomId)
        room.leave(user)
        if(room.members.length===0) {
            console.log(`모든 멤버가 나간 방 ${room.id.substring(0,8)}을 제거합니다.`)
            room = null // destroy room
        }
        user.notifyRoomStatus()
    }

    // 모든 유저 정보 전송: 유저목록 UI 업데이트 필요 시 호출 (신규 유저 가입할 때)
    notifyUserStatusTo(user) {
        const userStatus = this.users.map(user => ({
            id: user.id,
            nickname: user.nickname,
            thumbnail: user.thumbnail,
        }))
        user.socket.emit('user_status', userStatus)
    }
    
    // 해당 ID를 가진 User 인스턴스 검색
    findUserById(id) {
        return this.users.find(user => id === user.id)
    }
}

module.exports = Lobby
