require('dotenv').config()

const http = require('http')
const app = require('express')()
const socketIO = require('socket.io')
const kakaotalk = require('./kakaotalk')

const PORT = process.env.PORT || 4000
const server = http.createServer(app)

const io = socketIO(server)
kakaotalk(io)

server.listen(PORT, () => console.log(`Server listening at ${PORT}`))