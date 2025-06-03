import { Server, Socket } from 'socket.io';
import { BundlePositionSocketData, SocketResponse, SOCKET_EVENTS } from './socket.types';
import { BundlePositionService } from '../modules/Bundle/bundlePosition.service';

export class BundleSocketService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  // Handle bundle position update via socket
  async handleBundlePositionUpdate(
    socket: Socket,
    data: BundlePositionSocketData
  ): Promise<void> {
    try {
      // Add timestamp and user info
      const payload = {
        ...data,
        timestamp: new Date(),
        userId: socket.data.userId || 'anonymous'
      };

      // Update bundle position using existing service
      const result = await BundlePositionService.updateBundlePosition(payload);

      // Emit success to all clients in the board rooms
      const boardRooms = this.getBoardRooms(data);

      boardRooms.forEach(room => {
        this.io.to(room).emit(SOCKET_EVENTS.BUNDLE_POSITION_UPDATED, {
          success: true,
          message: 'Bundle position updated successfully',
          data: {
            ...result.data,
            updatedBy: socket.data.userId,
            timestamp: payload.timestamp
          }
        } as SocketResponse);
      });

      // Send confirmation to the sender
      socket.emit(SOCKET_EVENTS.BUNDLE_POSITION_UPDATED, {
        success: true,
        message: 'Bundle position updated successfully',
        data: result.data
      } as SocketResponse);

    } catch (error: any) {
      // Send error to the sender
      socket.emit(SOCKET_EVENTS.BUNDLE_POSITION_ERROR, {
        success: false,
        message: 'Failed to update bundle position',
        error: error.message
      } as SocketResponse);
    }
  }

  // Get relevant board rooms for broadcasting
  private getBoardRooms(data: BundlePositionSocketData): string[] {
    const rooms = [`board:${data._id}`]; // Target board room

    // If moving between different boards, we might need to notify the source board too
    // This would require additional logic to track the source board

    return rooms;
  }

  // Handle user joining a board room
  handleJoinBoard(socket: Socket, boardId: string): void {
    const roomName = `board:${boardId}`;
    socket.join(roomName);

    socket.emit('board:joined', {
      success: true,
      message: `Joined board ${boardId}`,
      data: { boardId, roomName }
    });

    // Notify others in the room
    socket.to(roomName).emit('user:joined', {
      userId: socket.data.userId,
      boardId,
      timestamp: new Date()
    });
  }

  // Handle user leaving a board room
  handleLeaveBoard(socket: Socket, boardId: string): void {
    const roomName = `board:${boardId}`;
    socket.leave(roomName);

    socket.emit('board:left', {
      success: true,
      message: `Left board ${boardId}`,
      data: { boardId, roomName }
    });

    // Notify others in the room
    socket.to(roomName).emit('user:left', {
      userId: socket.data.userId,
      boardId,
      timestamp: new Date()
    });
  }
}
