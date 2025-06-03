import { Activity } from './activity.model';
import { Types } from 'mongoose';

const getDashboardStats = async (userId?: string, organizationId?: string) => {
  const matchCondition: any = { isDeleted: false };

  if (userId) {
    matchCondition.userId = new Types.ObjectId(userId);
  }

  // Get activity counts by type
  const activityByType = await Activity.aggregate([
    { $match: matchCondition },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 }
      }
    }
  ]);

  // Get activity counts by module
  const activityByModule = await Activity.aggregate([
    { $match: matchCondition },
    {
      $group: {
        _id: '$module',
        count: { $sum: 1 }
      }
    }
  ]);

  // Get recent activities (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentActivities = await Activity.find({
    ...matchCondition,
    createdAt: { $gte: sevenDaysAgo }
  })
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })
    .limit(10);

  // Get daily activity trend (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const dailyTrend = await Activity.aggregate([
    {
      $match: {
        ...matchCondition,
        createdAt: { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
    }
  ]);

  // Get most active users
  const mostActiveUsers = await Activity.aggregate([
    { $match: matchCondition },
    {
      $group: {
        _id: '$userId',
        activityCount: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
    },
    {
      $project: {
        userId: '$_id',
        userName: '$user.name',
        userEmail: '$user.email',
        activityCount: 1
      }
    },
    {
      $sort: { activityCount: -1 }
    },
    {
      $limit: 5
    }
  ]);

  return {
    activityByType,
    activityByModule,
    recentActivities,
    dailyTrend,
    mostActiveUsers,
    totalActivities: await Activity.countDocuments(matchCondition)
  };
};

const getActivityHeatmap = async (userId?: string, year?: number) => {
  const currentYear = year || new Date().getFullYear();
  const startDate = new Date(currentYear, 0, 1);
  const endDate = new Date(currentYear, 11, 31);

  const matchCondition: any = {
    isDeleted: false,
    createdAt: { $gte: startDate, $lte: endDate }
  };

  if (userId) {
    matchCondition.userId = new Types.ObjectId(userId);
  }

  const heatmapData = await Activity.aggregate([
    { $match: matchCondition },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        date: {
          $dateFromParts: {
            year: '$_id.year',
            month: '$_id.month',
            day: '$_id.day'
          }
        },
        count: 1,
        _id: 0
      }
    },
    {
      $sort: { date: 1 }
    }
  ]);

  return heatmapData;
};

export const ActivityDashboardService = {
  getDashboardStats,
  getActivityHeatmap,
};
