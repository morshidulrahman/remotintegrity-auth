import { Server, Socket } from 'socket.io';
import { BundleSocketService } from './bundleSocket.service';
import { SOCKET_EVENTS, BundlePositionSocketData } from './socket.types';

export class SocketHandler {
  private io: Server;
  private bundleSocketService: BundleSocketService;

  constructor(io: Server) {
    this.io = io;
    this.bundleSocketService = new BundleSocketService(io);
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.io.on(SOCKET_EVENTS.CONNECT, (socket: Socket) => {
      console.log(`User connected: ${socket.id}`);

      // Handle bundle position updates
      socket.on(
        SOCKET_EVENTS.BUNDLE_POSITION_UPDATE,
        (data: BundlePositionSocketData) => {
          this.bundleSocketService.handleBundlePositionUpdate(socket, data);
        }
      );

      // Handle joining board rooms
      socket.on(SOCKET_EVENTS.JOIN_BOARD, (boardId: string) => {
        this.bundleSocketService.handleJoinBoard(socket, boardId);
      });

      // Handle leaving board rooms
      socket.on(SOCKET_EVENTS.LEAVE_BOARD, (boardId: string) => {
        this.bundleSocketService.handleLeaveBoard(socket, boardId);
      });

      // Handle disconnection
      socket.on(SOCKET_EVENTS.DISCONNECT, () => {
        console.log(`User disconnected: ${socket.id}`);
        // Clean up any rooms or resources if needed
      });

      // Handle errors
      socket.on('error', (error) => {
        console.error(`Socket error for ${socket.id}:`, error);
      });
    });
  }

  // Method to broadcast bundle updates to specific boards
  public broadcastToBoardMembers(boardId: string, event: string, data: any): void {
    this.io.to(`board:${boardId}`).emit(event, data);
  }

  // Method to get connected users in a board
  public async getBoardUsers(boardId: string): Promise<string[]> {
    const room = this.io.sockets.adapter.rooms.get(`board:${boardId}`);
    return room ? Array.from(room) : [];
  }
}
