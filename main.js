const socket = io('http://localhost:3000')

socket.on('danh-sach-user', (listUser) => {
	listUser.forEach((user) => $('.list').append(`<li id=${user.id}>${user.name}</li>`))

    socket.on('co-user-moi', (user) => {
        $('.list').append(`<li id=${user.id}>${user.name}</li>`)
    })
})

socket.on('co-user-disconnect', peerId => {
    $(`#${peerId}`).remove()
})

function openStream() {
	const config = { audio: false, video: true }
	return navigator.mediaDevices.getUserMedia(config)
}

function playStream(id, stream) {
	const video = document.getElementById(id)
	video.srcObject = stream
	video.play()
}

const peer = new Peer()
peer.on('open', (id) => {
	$('#sign-up').click(() => {
		socket.emit('user-dang-ki', { name: $('#name').val(), id: id })
	})
})

$('#call').click(() => {
	const id = $('input').val()
	openStream().then((stream) => {
		playStream('localStream', stream)
		const call = peer.call(id, stream)

		// ho tra loi
		call.on('stream', (remoteStream) => {
			playStream('remoteStream', remoteStream)
		})
	})
})

peer.on('call', (call) => {
	openStream().then((stream) => {
		call.answer(stream)
		playStream('localStream', stream)
		call.on('stream', (remoteStream) => {
			playStream('remoteStream', remoteStream)
		})
	})
})


$('.list').on('click', 'li', function(e){
    const id = e.target.getAttribute('id')
    openStream().then((stream) => {
		playStream('localStream', stream)
		const call = peer.call(id, stream)

		// ho tra loi
		call.on('stream', (remoteStream) => {
			playStream('remoteStream', remoteStream)
		})
	})
})