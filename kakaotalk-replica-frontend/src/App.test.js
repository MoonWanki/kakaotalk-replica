import React from 'react'
import { shallow } from 'enzyme'
import App from './App'
import { Login, Main, FriendList, RoomList, Room } from 'Layout'
import Message from 'Layout/Room/Message'
const socket = require('socket.io-client')('http://localhost:4000')

describe('App', () => {

	let app

	it('Render App', () => {
		app = shallow(<App />)
		expect(app.find(Login).exists()).toBe(true)
	})
})

describe('Login', () => {

	let login, idInput, loginButton

	it('Render Login', () => {
		login = shallow(<Login socket={socket} />)

		expect(login.find('input').length).toBe(2)
		idInput = login.find('input').first()
		expect(login.find('.login-button').exists()).toBe(true)
		loginButton = login.find('.login-button')
	})

	describe('Login with ID', () => {
		it('Fill ID out', () => {
			const id = 'testid'

			idInput.simulate('change', { target: { value: id }})
			expect(login.state('id')).toBe(id)
		})
	
		it('Handle invalid ID', () => {
			const invalidId = '!@#$%^&*'
	
			idInput.simulate('change', { target: { value: invalidId }})
			loginButton.simulate('click')
			expect(login.state('invalidIdDialogOpen')).toBe(true)
		})
	})

})

describe('Main', () => {

	let main

	it('Render Main', () => {
		main = shallow(<Main socket={socket} />)

		expect(main.find(FriendList).exists()).toBe(true)
		expect(main.find(RoomList).exists()).toBe(false)
		expect(main.find(Room).exists()).toBe(false)
	})

	it('View changing', () => {
		const tabItems = main.find('.home-tab-item')
		expect(tabItems.length).toBe(4)

		tabItems.at(1).simulate('click')
		expect(main.state('view')).toBe(1)
		tabItems.at(2).simulate('click')
		expect(main.state('view')).toBe(2)
		tabItems.at(0).simulate('click')
		expect(main.state('view')).toBe(0)
	})

	describe('Messaging', () => {
		const myInfo = { id: 'id1', nickname: 'foo', thumbnail: 1 }
		const friends = [
			{ id: 'id2', nickname: 'bar', thumbnail: 2 },
			{ id: 'id3', nickname: 'man', thumbnail: 3 }
		]
		let sampleRoom = {
			id: 1,
			members: [myInfo, ...friends],
			messages: [
				{
					user: myInfo,
					type: 'text',
					content: 'I hate foobar',
					timestamp: new Date(2019, 3, 13, 0, 0),
					unreadIds: ['id3'],
				},
				{
					user: friends[0],
					type: 'text',
					content: 'Me too',
					timestamp: new Date(2019, 3, 13, 0, 1),
					unreadIds: ['id3'],
				}
			]
		}

		let component

		it('Update room', () => {
			component = shallow(<Room socket={socket} myInfo={myInfo} room={sampleRoom} friends={friends} />)
			expect(component.find(Message).length).toBe(sampleRoom.messages.length)
		})

		it('Update friendlist', () => {
			component = shallow(<FriendList myInfo={myInfo} friends={friends} />)
			expect(component.find('.friendlist-profile').length).toBe(friends.length + 1)
		})

		it('Update roomlist', () => {
			component = shallow(<RoomList myInfo={myInfo} friends={friends} rooms={[sampleRoom, sampleRoom, sampleRoom]} />)
			expect(component.find('.roomlist-item').length).toBe(3)
		})
	})
		
})