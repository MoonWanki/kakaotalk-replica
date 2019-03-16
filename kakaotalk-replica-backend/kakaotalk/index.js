const Lobby  = require('./Lobby')
const User = require('./User')

module.exports = io => {

    const lobby = new Lobby()

    io.on('connection', socket => {

        socket.on('login', id => {
            console.log('login request by', id)
            const user = lobby.findUserById(id)
            
            // unregistered (new) user
            if(typeof user === 'undefined') {
                socket.emit('unregistered')
            }

            // already connected user
            else if(user.isOnline) {
                console.log(user.nickname, 'forced login')
                socket.emit('already_connected')
                socket.on('force_login', async () => {
                    lobby.kick(user)
                    await new Promise(resolve => setTimeout(resolve, 200))
                    user.socket = socket
                    lobby.join(user)
                })
            }

            // login available
            else {
                user.socket = socket
                lobby.join(user)
            }
        })

        socket.on('register', (id, nickname, thumbnail) => {
            console.log('register request by', id, 'with nickname of', nickname)
            const newUser = new User(socket, id, nickname, thumbnail)
            lobby.register(newUser)
            lobby.join(newUser)
        })
    })
}
