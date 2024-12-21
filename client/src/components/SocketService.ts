import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:5200";

class SocketService {
  public socket: Socket;

  constructor() {
    this.socket = io(SOCKET_URL);
  }

  public createGameSession(callback: (newSession: any) => void) {
    this.socket.emit("createGameSession", callback);
  }

  public joinGameSession(sessionId: string, callback: (session: any) => void) {
    this.socket.emit("joinGameSession", sessionId, callback);
  }

  public leaveGameSession(sessionId: string) {
    this.socket.emit("leaveGameSession", sessionId);
    this.socket.close();
  }

  public sendMove(sessionId: string, coordinates: { x: number, y: number }) {
    this.socket.emit("makeMove", { sessionId, coordinates });
  }
}

export default new SocketService();