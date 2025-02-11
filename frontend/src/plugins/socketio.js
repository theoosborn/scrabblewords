import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_APP_SERVER_ADDRESS;

const socket = io(URL, { autoConnect: false });

if (process.env.NODE_ENV !== "production") {
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });
}

export default socket;
