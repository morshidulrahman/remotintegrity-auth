import mongoose, { model, Types } from 'mongoose';
import { ActivityModel, TActivity } from './activity.interface';

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  time: {
    type: String,
    default: '',
  },
  ActivityTitle: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['create', 'update', 'delete'],
    default: 'create',
    required: true,
  },
  module: {
    type: String,
    enum: ['user', 'company', 'contact', 'project', 'task', 'role', 'bundle', 'board', 'position', 'pboard', 'employee', 'activity'],
    default: 'user',
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  link: {
    type: String,
    default: '',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Indexes for better performance
activitySchema.index({ userId: 1, createdAt: -1 });
activitySchema.index({ module: 1, type: 1 });
activitySchema.index({ date: 1 });
activitySchema.index({ isDeleted: 1 });

// Static method to check if user exists
activitySchema.statics.isUserExists = async function (id: string) {
  return await this.findOne({ userId: id, isDeleted: false });
};

// Pre-save middleware to update timestamps
activitySchema.pre('save', function (next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

// Pre-update middleware to update timestamps
activitySchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

export const Activity = model<TActivity, ActivityModel>('Activity', activitySchema);
