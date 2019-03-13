const Lobby  = require('./Lobby')
const User = require('./User')

module.exports = io => {

    const lobby = new Lobby()

    io.on('connection', socket => {

        socket.on('login', id => {

            const user = lobby.findUserById(id)
            
            // unregistered (new) user
            if(typeof user === 'undefined') {
                socket.emit('unregistered')
            }

            // already connected user
            else if(user.isOnline) {
                socket.emit('already_connected')
                socket.on('force_login', () => {
                    lobby.kick(user)
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

        socket.on('register', (id, nickname) => {
            socket.removeAllListeners('register')
            const newUser = new User(socket, id, nickname)
            lobby.register(newUser)
            lobby.join(newUser)
        })
    })
}
