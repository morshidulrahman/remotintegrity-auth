import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ActivityService } from './activity.service';
import { Types } from 'mongoose';

const createActivity = catchAsync(async (req, res) => {
  const result = await ActivityService.createActivity(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Activity created successfully',
    data: result,
  });
});

const createBulkActivities = catchAsync(async (req, res) => {
  const { activities } = req.body;
  const result = await ActivityService.createBulkActivities(activities);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Activities created successfully',
    data: result,
  });
});

const getAllActivities = catchAsync(async (req, res) => {
  const result = await ActivityService.getAllActivities(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Activities retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

const getActivityById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ActivityService.getActivityById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Activity retrieved successfully',
    data: result,
  });
});

const getActivitiesByUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await ActivityService.getActivitiesByUser(userId, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User activities retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

const getActivitiesByModule = catchAsync(async (req, res) => {
  const { module } = req.params;


  const result = await ActivityService.getActivitiesByModule(module.toLowerCase(), req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Module activities retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

const getActivitiesByDateRange = catchAsync(async (req, res) => {
  const { startDate, endDate } = req.query;
  const start = new Date(startDate as string);
  const end = new Date(endDate as string);

  const result = await ActivityService.getActivitiesByDateRange(start, end, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Activities retrieved successfully',
    data: result,
  });
});

const getActivityStats = catchAsync(async (req, res) => {
  const { userId } = req.query;
  const result = await ActivityService.getActivityStats(userId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Activity statistics retrieved successfully',
    data: result,
  });
});

const updateActivity = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ActivityService.updateActivity(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Activity updated successfully',
    data: result,
  });
});

const deleteActivity = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.userId || new Types.ObjectId();
  const result = await ActivityService.deleteActivity(id, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Activity deleted successfully',
    data: result,
  });
});

const cleanupOldActivities = catchAsync(async (req, res) => {
  const { days } = req.query;
  const daysToKeep = days ? parseInt(days as string) : 90;
  const deletedCount = await ActivityService.cleanupOldActivities(daysToKeep);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Cleanup completed. ${deletedCount} old activities removed.`,
    data: { deletedCount },
  });
});

export const ActivityController = {
  createActivity,
  createBulkActivities,
  getAllActivities,
  getActivityById,
  getActivitiesByUser,
  getActivitiesByModule,
  getActivitiesByDateRange,
  getActivityStats,
  updateActivity,
  deleteActivity,
  cleanupOldActivities,
};
