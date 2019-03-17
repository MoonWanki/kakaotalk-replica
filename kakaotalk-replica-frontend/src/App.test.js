import React from 'react'
import { shallow } from 'enzyme'
import App from './App'
import { Login, Main, FriendList, RoomList, Room } from 'Layout'
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

	describe('View changing', () => {

		it('Tab menus working', () => {
			const tabItems = main.find('.home-tab-item')
			expect(tabItems.length).toBe(4)

			tabItems.at(1).simulate('click')
			expect(main.state('view')).toBe(1)
			tabItems.at(2).simulate('click')
			expect(main.state('view')).toBe(2)
			tabItems.at(0).simulate('click')
			expect(main.state('view')).toBe(0)
		})

	})
	
})