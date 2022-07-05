import { io, Socket } from "socket.io-client";

export class SocketConnection {
    private static instance: Socket;
    private constructor() { }
    public static getInstance(): Socket {
        if (!SocketConnection.instance) {
            SocketConnection.instance = io("ws://localhost:4000");
        }

        return SocketConnection.instance;
    }
}