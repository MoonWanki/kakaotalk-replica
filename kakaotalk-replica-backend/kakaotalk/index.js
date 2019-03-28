const Lobby  = require('./Lobby')
const User = require('./User')

module.exports = io => {

    const lobby = new Lobby()

    io.on('connection', socket => {

        // 로그인 요청
        socket.on('login', id => {

            // 해당 ID를 가진 User 인스턴스 탐색
            const user = lobby.findUserById(id)
            
            // 없는 ID: 'unregistered' 이벤트 전송
            if(typeof user === 'undefined') {
                socket.emit('unregistered')
            }

            // 이미 접속 중인 ID: 'already_connected' 이벤트 전송
            else if(user.isOnline) {
                socket.emit('already_connected')
            }

            // 로그인 가능: socket 객체 user저장 후 join 시킴
            else {
                user.socket = socket
                lobby.join(user)
            }
        })

        // 회원가입 요청
        socket.on('register', (id, nickname, thumbnail) => {
            console.log('register request by', id, 'with nickname of', nickname)
            const newUser = new User(socket, id, nickname, thumbnail)
            lobby.register(newUser)
            lobby.join(newUser)
        })

        // 강제로그아웃 후 로그인 요청
        socket.on('force_login', async () => {
            lobby.kick(user)
            await new Promise(resolve => setTimeout(resolve, 200))
            user.socket = socket
            lobby.join(user)
        })
    })
}
