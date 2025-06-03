import { Types } from 'mongoose';
import { TCreateActivity } from './activity.interface';

export const createMockActivity = (overrides: Partial<TCreateActivity> = {}): TCreateActivity => {
  return {
    userId: new Types.ObjectId(),
    ActivityTitle: 'Test Activity',
    type: 'create',
    module: 'user',
    description: 'This is a test activity',
    link: '/test-link',
    time: new Date().toLocaleTimeString(),
    ...overrides,
  };
};

export const createMockActivities = (count: number, overrides: Partial<TCreateActivity> = {}): TCreateActivity[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockActivity({
      ActivityTitle: `Test Activity ${index + 1}`,
      description: `This is test activity number ${index + 1}`,
      ...overrides,
    })
  );
};

export const mockActivityResponse = {
  success: true,
  message: 'Activity created successfully',
  data: {
    _id: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    ActivityTitle: 'Test Activity',
    type: 'create',
    module: 'user',
    description: 'Test description',
    link: '/test',
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};
