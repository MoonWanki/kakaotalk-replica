require('dotenv').config()
const PORT = process.env.PORT || 4000
const kakaotalk = require('./kakaotalk')

const io = require('socket.io').listen(PORT)

kakaotalk(io)

console.log(`Server running on ${PORT}`)
