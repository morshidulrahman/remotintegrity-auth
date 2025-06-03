// USE THIS FOR FUTURE USE OF SOCKETS KANBAN



// // app.ts ---------------------------------------------------------
// import express from 'express';
// import { createServer } from 'http';
// import { Server } from 'socket.io';
// import cors from 'cors';
// import { SocketHandler } from './app/socket/socket.handler';
//
// const app = express();
// const server = createServer(app);
//
// // Socket.IO setup with CORS
// const io = new Server(server, {
//   cors: {
//     origin: process.env.CLIENT_URL || "http://localhost:3000",
//     methods: ["GET", "POST"],
//     credentials: true
//   }
// });
//
// // Initialize socket handler
// const socketHandler = new SocketHandler(io);
//
// // Make io available globally (optional)
// app.set('io', io);
//
// // Your existing middleware and routes...
// app.use(cors());
// app.use(express.json());
//
// // Export both app and server
// export { app, server, io };
// // ----------------------------------------------------------
//
// // server.ts ---------------------------------------------------------
// import { server } from './app';
//
// const PORT = process.env.PORT || 5000;
//
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`Socket.IO server ready`);
// });
// // ----------------------------------------------------------
//
// // bundlePosition.service.ts ---------------------------------------------------------
// import mongoose from 'mongoose';
// import { Bundle } from './bundle.model';
// import { Board } from '../Boards/board.model';
// import { TBundlePositionRequest } from './bundlePosition.interface';
// import AppError from '../../errors/AppError';
//
// const updateBundlePosition = async (payload: TBundlePositionRequest, emitSocket = false) => {
//   const { _id: targetBoardId, selectedBundleID, targetBundleID, isAbove } = payload;
//
//   const session = await mongoose.startSession();
//   session.startTransaction();
//
//   try {
//     // ... existing validation and update logic ...
//
//     await session.commitTransaction();
//
//     const result = {
//       success: true,
//       message: 'Bundle position updated successfully',
//       data: {
//         selectedBundleID,
//         targetBoardId,
//         targetBundleID,
//         isAbove,
//         timestamp: new Date()
//       }
//     };
//
//     // Emit socket event if requested (for REST API calls)
//     if (emitSocket) {
//       const io = require('../../app').io;
//       if (io) {
//         io.to(`board:${targetBoardId}`).emit('bundle:position:updated', result);
//       }
//     }
//
//     return result;
//
//   } catch (error) {
//     await session.abortTransaction();
//     throw error;
//   } finally {
//     await session.endSession();
//   }
// };
//
// export const BundlePositionService = {
//   updateBundlePosition
// };
// // ----------------------------------------------------------
//
// // bundlePosition.controller.ts ---------------------------------------------------------
// import { Request, Response } from 'express';
// import catchAsync from '../../utils/catchAsync';
// import sendResponse from '../../utils/sendResponse';
// import { BundlePositionService } from './bundlePosition.service';
// import { TBundlePositionRequest } from './bundlePosition.interface';
//
// const updateBundlePosition = catchAsync(async (req: Request, res: Response) => {
//   const payload: TBundlePositionRequest = req.body;
//
//   // Enable socket emission for REST API calls
//   const result = await BundlePositionService.updateBundlePosition(payload, true);
//
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Bundle position updated successfully',
//     data: result.data,
//   });
// });
//
// export const BundlePositionController = {
//   updateBundlePosition
// };
// // ----------------------------------------------------------
//
// // frontend can use Socket.IO for real-time updates -----------------------------------------------------------
// // Frontend Socket.IO integration example
// import io from 'socket.io-client';
//
// const socket = io('http://localhost:5000');
//
// // Join a board room when user opens a board
// const joinBoard = (boardId) => {
//   socket.emit('board:join', boardId);
// };
//
// // Update bundle position in real-time
// const updateBundlePosition = (bundleData) => {
//   socket.emit('bundle:position:update', bundleData);
// };
//
// // Listen for real-time updates
// socket.on('bundle:position:updated', (data) => {
//   // Update UI with new bundle positions
//   console.log('Bundle position updated:', data);
//   updateBoardUI(data);
// });
//
// socket.on('bundle:position:error', (error) => {
//   console.error('Bundle position update failed:', error);
//   showErrorMessage(error.message);
// });
//
// // ----------------------------------------------------------
