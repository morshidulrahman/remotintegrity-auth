export interface BundlePositionSocketData {
  _id: string; // target board ID
  selectedBundleID: string;
  targetBundleID?: string | null;
  isAbove: boolean;
  userId?: string; // user who made the change
  timestamp: Date;
}

export interface SocketResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export const SOCKET_EVENTS = {
  // Bundle position events
  BUNDLE_POSITION_UPDATE: 'bundle:position:update',
  BUNDLE_POSITION_UPDATED: 'bundle:position:updated',
  BUNDLE_POSITION_ERROR: 'bundle:position:error',

  // Room management
  JOIN_BOARD: 'board:join',
  LEAVE_BOARD: 'board:leave',

  // General events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
} as const;
