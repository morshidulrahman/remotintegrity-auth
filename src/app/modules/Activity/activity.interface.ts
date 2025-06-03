import { Model, Types } from 'mongoose';

export type TActivity = {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  date: Date;
  time: string;
  ActivityTitle: string;
  type: 'create' | 'update' | 'delete';
  module: 'user' | 'company' | 'contact' | 'project' | 'task' | 'role' | 'bundle' | 'board' | 'position' | 'pboard' | 'employee' | 'activity';
  description: string;
  link: string;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  deletedBy?: Types.ObjectId;
};

export type TCreateActivity = {
  userId: Types.ObjectId;
  ActivityTitle: string;
  type: 'create' | 'update' | 'delete';
  module: 'user' | 'company' | 'contact' | 'project' | 'task' | 'role' | 'bundle' | 'board' | 'position' | 'pboard' | 'employee' | 'activity';
  description: string;
  link?: string;
  time?: string;
};

export type TActivityStats = {
  _id: string;
  modules: Array<{
    module: string;
    count: number;
  }>;
  totalCount: number;
};

export type TActivityDashboard = {
  activityByType: Array<{ _id: string; count: number }>;
  activityByModule: Array<{ _id: string; count: number }>;
  recentActivities: TActivity[];
  dailyTrend: Array<{
    _id: { year: number; month: number; day: number };
    count: number;
  }>;
  mostActiveUsers: Array<{
    userId: Types.ObjectId;
    userName: string;
    userEmail: string;
    activityCount: number;
  }>;
  totalActivities: number;
};

export type TActivityHeatmap = Array<{
  date: Date;
  count: number;
}>;

export interface ActivityModel extends Model<TActivity> {
  isUserExists(id: string): Promise<TActivity | null>;
}
