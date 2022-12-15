const socket = io()

socket.on('users' , (mss) => {
    console.log(mss)
})

