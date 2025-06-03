
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

export class ActivityNotFoundError extends AppError {
  constructor(id: string) {
    super(httpStatus.NOT_FOUND, `Activity with ID ${id} not found`);
  }
}

export class InvalidActivityModuleError extends AppError {
  constructor(module: string) {
    super(httpStatus.BAD_REQUEST, `Invalid activity module: ${module}`);
  }
}

export class InvalidActivityTypeError extends AppError {
  constructor(type: string) {
    super(httpStatus.BAD_REQUEST, `Invalid activity type: ${type}`);
  }
}

export class ActivityCreationError extends AppError {
  constructor(message: string = 'Failed to create activity') {
    super(httpStatus.INTERNAL_SERVER_ERROR, message);
  }
}

export class ActivityUpdateError extends AppError {
  constructor(message: string = 'Failed to update activity') {
    super(httpStatus.INTERNAL_SERVER_ERROR, message);
  }
}

export class ActivityDeletionError extends AppError {
  constructor(message: string = 'Failed to delete activity') {
    super(httpStatus.INTERNAL_SERVER_ERROR, message);
  }
}

export class BulkActivityError extends AppError {
  constructor(message: string = 'Failed to process bulk activities') {
    super(httpStatus.INTERNAL_SERVER_ERROR, message);
  }
}
