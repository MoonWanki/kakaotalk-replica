import React, { Component } from 'react'

export default class Thumbnail extends Component {
    render() {
        const { type, round, big } = this.props
        const width = big ? 60 : 48
        return (
            <div style={{
                width: width,
                height: width,
                borderRadius: round ? width/2 : 0,
                background: `url(${require(`images/thumbnail_${type}.jpg`)}) center / contain no-repeat`,
            }} />
        )
    }
}
