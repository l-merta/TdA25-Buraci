// src/socket.ts
import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_WS_URL || `${window.location.protocol}//${window.location.hostname}`;
console.log(SOCKET_URL);

const socket: Socket = io(SOCKET_URL);

export default socket;