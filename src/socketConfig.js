import openSocket from 'socket.io-client';

const socket = openSocket("ws://localhost:8080");

export default socket;