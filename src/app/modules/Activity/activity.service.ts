import { Types } from 'mongoose';
import { Activity } from './activity.model';
import { TActivity, TCreateActivity } from './activity.interface';
import QueryBuilder from '../../builder/QueryBuilder';

const createActivity = async (payload: TCreateActivity): Promise<TActivity> => {
  const currentTime = new Date();

  const activityData = {
    ...payload,
    date: currentTime,
    time: payload.time || currentTime.toLocaleTimeString(),
    link: payload.link || '',
    createdBy: payload.userId,
  };

  const result = await Activity.create(activityData);
  return result;
};

const createBulkActivities = async (activities: TCreateActivity[]): Promise<TActivity[]> => {
  const currentTime = new Date();

  const activitiesData = activities.map(activity => ({
    ...activity,
    date: currentTime,
    time: activity.time || currentTime.toLocaleTimeString(),
    link: activity.link || '',
    createdBy: activity.userId,
  }));

  const result = await Activity.insertMany(activitiesData);
  return result;
};

const getAllActivities = async (query: Record<string, unknown>) => {
  const activityQuery = new QueryBuilder(
    Activity.find({ isDeleted: false })
      .populate('userId', 'name email avatar')
      .populate('createdBy', 'name email'),
      // .populate('updatedBy', 'name email'),
    query,
  )
    .globalSearch(['ActivityTitle', 'description', 'module'])
    .dateRange('date')
    .filter()
    .sort()
    .paginate()
    .fields();

  const queryResult = await activityQuery.execute();

  // Group Activities by date
  const groupedByDate = queryResult.data.reduce((acc: any, activity: any) => {
    const activityDate = new Date(activity.date);
    const formattedDate = activityDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const existingDateGroup = acc.find((group: any) => group.date === formattedDate);

    if (existingDateGroup) {
      existingDateGroup.events.push(activity);
    } else {
      acc.push({
        date: formattedDate,
        events: [activity]
      });
    }

    return acc;
  }, []);

  return {
    data: groupedByDate,
    meta: queryResult.meta
  };
};

const getActivityById = async (id: string): Promise<TActivity | null> => {
  const result = await Activity.findById(id)
    .populate('userId', 'name email')
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');
  return result;
};

const getActivitiesByUser = async (userId: string, query: Record<string, unknown>) => {
  const activityQuery = new QueryBuilder(
    Activity.find({ userId: new Types.ObjectId(userId), isDeleted: false })
      .populate('userId', 'name email')
      .populate('createdBy', 'name email'),
    query,
  )
    .globalSearch(['ActivityTitle', 'description'])
    .dateRange('date')
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await activityQuery.execute();
  return result;
};

const getActivitiesByModule = async (module: string, query: Record<string, unknown>) => {
  const searchableFields = ['ActivityTitle', 'description'];

  const activityQuery = new QueryBuilder(
    Activity.find({ module, isDeleted: false })
      .populate('userId', 'name email avatar')
      .populate('createdBy', 'name email'),
    query,
  )
    .globalSearch(searchableFields)
    .dateRange('date')
    .filter()
    .sort()
    .paginate()
    .fields();

  const queryResult = await activityQuery.execute();

  // Group Activities by date
  const groupedByDate = queryResult.data.reduce((acc: any, activity: any) => {
    const activityDate = new Date(activity.date);
    const formattedDate = activityDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const existingDateGroup = acc.find((group: any) => group.date === formattedDate);

    if (existingDateGroup) {
      existingDateGroup.events.push(activity);
    } else {
      acc.push({
        date: formattedDate,
        events: [activity]
      });
    }

    return acc;
  }, []);

  return {
    data: groupedByDate,
    meta: queryResult.meta
  };
};

const getActivitiesByDateRange = async (
  startDate: Date,
  endDate: Date,
  query: Record<string, unknown>
) => {
  const activityQuery = new QueryBuilder(
    Activity.find({
      date: { $gte: startDate, $lte: endDate },
      isDeleted: false
    })
      .populate('userId', 'name email')
      .populate('createdBy', 'name email'),
    query,
  )
    .globalSearch(['ActivityTitle', 'description'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await activityQuery.execute();
  return result;
};

const getActivityStats = async (userId?: string) => {
  const matchCondition: any = { isDeleted: false };
  if (userId) {
    matchCondition.userId = new Types.ObjectId(userId);
  }

  const stats = await Activity.aggregate([
    { $match: matchCondition },
    {
      $group: {
        _id: {
          type: '$type',
          module: '$module'
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.type',
        modules: {
          $push: {
            module: '$_id.module',
            count: '$count'
          }
        },
        totalCount: { $sum: '$count' }
      }
    }
  ]);

  return stats;
};

const updateActivity = async (id: string, payload: Partial<TActivity>): Promise<TActivity | null> => {
  const result = await Activity.findByIdAndUpdate(
    id,
    { ...payload, updatedAt: new Date() },
    { new: true, runValidators: true }
  );
  return result;
};

const deleteActivity = async (id: string, deletedBy: Types.ObjectId): Promise<TActivity | null> => {
  const result = await Activity.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy,
    },
    { new: true }
  );
  return result;
};

// Helper function to log activities from other modules
const logActivity = async (activityData: TCreateActivity): Promise<void> => {
  try {
    await createActivity(activityData);
  } catch (error) {
    console.error('Failed to log activity:', error);
    // Don't throw error to avoid breaking the main operation
  }
};

// Cleanup old activities (optional - for maintenance)
const cleanupOldActivities = async (daysToKeep: number = 90): Promise<number> => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const result = await Activity.deleteMany({
    createdAt: { $lt: cutoffDate },
    isDeleted: true
  });

  return result.deletedCount || 0;
};

export const ActivityService = {
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
  logActivity,
  cleanupOldActivities,
};
