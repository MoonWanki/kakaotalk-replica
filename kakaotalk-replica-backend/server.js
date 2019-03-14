require('dotenv').config()
const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const kakaotalk = require('./kakaotalk')
const port = process.env.PORT || 4000

const app = express()
app.use('/kakaotalk/res', express.static(path.join(__dirname, 'kakaotalk', 'res')))

const server = http.createServer(app)
server.listen(port, () => console.log(`Server running on ${port}`))

const io = socketio(server)
kakaotalk(io)

