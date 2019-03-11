const Lobby  = require('./Lobby')

module.exports = io => {

    const lobby = new Lobby()

    io.on('connection', socket => {

        socket.on('login', id => {

            const user = lobby.findUserById(id)
            
            if(typeof user === 'undefined') {
                socket.emit('unregistered')
                socket.on('register', nickname => {
                    socket.removeAllListeners('register')
                    const newUser = new User(socket, id, nickname)
                    lobby.register(newUser)
                    lobby.join(newUser)
                })
            }
            else if(user.isOnline) {
                socket.emit('already_connected')
                socket.on('force_login', () => {
                    lobby.kick(user)
                    user.socket = socket
                    lobby.join(user)
                })
            }
            else {
                lobby.join(user)
            }
        })
    })
}
