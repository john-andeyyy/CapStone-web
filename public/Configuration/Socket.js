import io from 'socket.io-client';

// Connect to the Socket.io server
const BASEURL = import.meta.env.VITE_BASEURL;

const Socket = io(BASEURL); // Update with your server URL

export default Socket;
