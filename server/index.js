const express = require('express')
const app = express()
const server = app.listen(3000)

const { Server } = require('socket.io')
const io = new Server(server, { cors: { origin: '*' } })
const listUser = []

io.on('connection', function (socket) {
	socket.on('user-dang-ki', user => {
		const exitUser = listUser.some(item => user.name == item.name)
		if(exitUser) return 
		listUser.push(user)

		socket.peerId = user.id
		socket.emit('danh-sach-user', listUser)
		socket.broadcast.emit('co-user-moi', user)
	})
	
	socket.on('disconnect', () => {
		const index = listUser.findIndex(user => user.id == socket.peerId)
		listUser.splice(index, 1)
		io.emit('co-user-disconnect', socket.peerId)
	})
})
