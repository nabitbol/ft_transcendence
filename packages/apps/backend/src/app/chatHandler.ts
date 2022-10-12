const registerChatHandlers = (io, socket) => {


	const addMessageChat = (message) => {
		console.log('message: ' + message);
		io.emit('chat:message', message);
	}

	socket.on("chat:message", addMessageChat);
  }

export {registerChatHandlers}