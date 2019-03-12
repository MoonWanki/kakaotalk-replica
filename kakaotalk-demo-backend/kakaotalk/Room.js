class Room {

    constructor(id) {
        this.id = id
        this.members = new Array()
        this.messages = new Array()
    }

    join(user) {
        if(user.findRoomById(this.id) != this) {
            this.members.push(user)
        }
    }
}

module.exports = Room