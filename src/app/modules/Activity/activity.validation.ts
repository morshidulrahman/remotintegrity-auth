import { z } from 'zod';

const createActivityValidationSchema = z.object({
  body: z.object({
    userId: z.string({
      required_error: 'User ID is required',
    }),
    ActivityTitle: z.string({
      required_error: 'Activity title is required',
    }).min(1, 'Activity title cannot be empty'),
    type: z.enum(['create', 'update', 'delete'], {
      required_error: 'Activity type is required',
    }),
    module: z.enum([
      'user',
      'company',
      'contact',
      'project',
      'task',
      'role',
      'bundle',
      'board',
      'position',
      'pboard',
      'employee',
      'activity',
    ], {
      required_error: 'Module is required',
    }),
    description: z.string({
      required_error: 'Description is required',
    }).min(1, 'Description cannot be empty'),
    link: z.string().optional(),
    time: z.string().optional(),
  }),
});

const createBulkActivitiesValidationSchema = z.object({
  body: z.object({
    activities: z.array(z.object({
      userId: z.string({
        required_error: 'User ID is required',
      }),
      ActivityTitle: z.string({
        required_error: 'Activity title is required',
      }).min(1, 'Activity title cannot be empty'),
      type: z.enum(['create', 'update', 'delete'], {
        required_error: 'Activity type is required',
      }),
      module: z.enum([
        'user',
        'company',
        'contact',
        'project',
        'task',
        'role',
        'bundle',
        'board',
        'position',
        'pboard',
        'employee',
        'activity',
      ], {
        required_error: 'Module is required',
      }),
      description: z.string({
        required_error: 'Description is required',
      }).min(1, 'Description cannot be empty'),
      link: z.string().optional(),
      time: z.string().optional(),
    })).min(1, 'At least one activity is required'),
  }),
});

const updateActivityValidationSchema = z.object({
  body: z.object({
    ActivityTitle: z.string().min(1, 'Activity title cannot be empty').optional(),
    description: z.string().min(1, 'Description cannot be empty').optional(),
    link: z.string().optional(),
    type: z.enum(['create', 'update', 'delete']).optional(),
    module: z.enum([
      'user',
      'company',
      'contact',
      'project',
      'task',
      'role',
      'bundle',
      'board',
      'position',
      'pboard',
      'employee',
      'activity',
    ]).optional(),
  }),
});

export const ActivityValidation = {
  createActivityValidationSchema,
  createBulkActivitiesValidationSchema,
  updateActivityValidationSchema,
};
