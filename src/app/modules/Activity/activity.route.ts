import express from 'express';
import { ActivityController } from './activity.controller';
import { ActivityDashboardController } from './activity.dashboard.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ActivityValidation } from './activity.validation';

const router = express.Router();

// Dashboard routes
router.get(
  '/dashboard/stats',
  // auth('admin', 'user'),
  auth('user', 'client', 'riuser', 'masterAdmin' ),
  ActivityDashboardController.getDashboardStats
);

router.get(
  '/dashboard/heatmap',
  //auth('admin', 'user'),
  auth('user', 'client', 'riuser', 'masterAdmin' ),
  ActivityDashboardController.getActivityHeatmap
);

// Create single activity
router.post(
  '/',
  //auth('admin', 'user'),
  auth('user', 'client', 'riuser', 'masterAdmin' ),
  validateRequest(ActivityValidation.createActivityValidationSchema),
  ActivityController.createActivity
);

// Create bulk activities
router.post(
  '/bulk',
  //auth('admin', 'user'),
  auth('user', 'client', 'riuser', 'masterAdmin' ),
  validateRequest(ActivityValidation.createBulkActivitiesValidationSchema),
  ActivityController.createBulkActivities
);

// Get all activities
router.get(
  '/',
  //auth('admin', 'user'),
  auth('user', 'client', 'riuser', 'masterAdmin' ),
  ActivityController.getAllActivities
);

// Get activity statistics
router.get(
  '/stats',
  //auth('admin', 'user'),
  auth('user', 'client', 'riuser', 'masterAdmin' ),
  ActivityController.getActivityStats
);

// Get activities by date range
router.get(
  '/date-range',
  //auth('admin', 'user'),
  auth('user', 'client', 'riuser', 'masterAdmin' ),
  ActivityController.getActivitiesByDateRange
);

// Get activities by user
router.get(
  '/user/:userId',
  //auth('admin', 'user'),
  auth('user', 'client', 'riuser', 'masterAdmin' ),
  ActivityController.getActivitiesByUser
);

// Get activities by module
router.get(
  '/module/:module',
  //auth('admin', 'user'),
  auth('user', 'client', 'riuser', 'masterAdmin' ),
  ActivityController.getActivitiesByModule
);

// Cleanup old activities (admin only)
router.delete(
  '/cleanup',
  //auth('admin'),
  auth('user', 'client', 'riuser', 'masterAdmin' ),
  ActivityController.cleanupOldActivities
);

// Get single activity
router.get(
  '/:id',
  //auth('admin', 'user'),
  auth('user', 'client', 'riuser', 'masterAdmin' ),
  ActivityController.getActivityById
);

// Update activity
router.patch(
  '/:id',
  //auth('admin'),
  auth('user', 'client', 'riuser', 'masterAdmin' ),
  validateRequest(ActivityValidation.updateActivityValidationSchema),
  ActivityController.updateActivity
);

// Delete activity
router.delete(
  '/:id',
  //auth('admin'),
  auth('user', 'client', 'riuser', 'masterAdmin' ),
  ActivityController.deleteActivity
);

export const ActivityRoutes = router;
