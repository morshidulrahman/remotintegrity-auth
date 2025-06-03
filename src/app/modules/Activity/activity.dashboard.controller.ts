import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ActivityDashboardService } from './activity.dashboard.service';

const getDashboardStats = catchAsync(async (req, res) => {
  const { userId, organizationId } = req.query;
  const result = await ActivityDashboardService.getDashboardStats(
    userId as string,
    organizationId as string
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dashboard statistics retrieved successfully',
    data: result,
  });
});

const getActivityHeatmap = catchAsync(async (req, res) => {
  const { userId, year } = req.query;
  const result = await ActivityDashboardService.getActivityHeatmap(
    userId as string,
    year ? parseInt(year as string) : undefined
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Activity heatmap data retrieved successfully',
    data: result,
  });
});

export const ActivityDashboardController = {
  getDashboardStats,
  getActivityHeatmap,
};
