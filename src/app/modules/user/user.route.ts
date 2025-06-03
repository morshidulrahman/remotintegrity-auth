import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserControllers } from './user.controller';
import { UserValidation } from './user.validation';
import activityLogger from '../../middlewares/activityLogger';

const router = express.Router();


// Register a new user
router.post(
  '/register',
  validateRequest(UserValidation.userValidationSchema),
  activityLogger({
    module: 'user',
    action: 'create',
    getTitle: () => 'User Created',
    getDescription: (req) => `Created new user: ${req.body.email}`,
  }),
  UserControllers.registerUser,
)

// Get User
router.get(
  '/profile',
  auth('user', 'client', 'riuser', 'masterAdmin' ),
  UserControllers.getUserProfile,
)

// Get All User
router.get(
  '/',
  auth('user', 'client', 'riuser', 'masterAdmin' ),
  UserControllers.getAllUsers,
)


// Get Single User
router.get(
  '/:id',
  auth('user', 'client', 'riuser', 'masterAdmin' ),
  UserControllers.getUserById,
)


// Update User
router.patch(
  '/profile',
  auth('user', 'client', 'riuser', 'masterAdmin' ),
  validateRequest(UserValidation.updateUserValidationSchema),
  activityLogger({
    module: 'user',
    action: 'update',
    getTitle: () => 'User Updated',
    getDescription: (req) => `Updated user name: ${req.body.name}`,
  }),
  UserControllers.updateUserProfile,
)

// Update User by ID
router.patch(
  '/:id',
  auth('user', 'client', 'riuser', 'masterAdmin' ),
  validateRequest(UserValidation.updateUserValidationSchema),
  activityLogger({
    module: 'user',
    action: 'update',
    getTitle: () => 'User Updated',
    getDescription: (req) => `Updated user name: ${req.body.name}`,
  }),
  UserControllers.updateUserById,
);

// Delete User
router.delete(
  '/profile',
  auth('user', 'client', 'riuser', 'masterAdmin' ),
  activityLogger({
    module: 'user',
    action: 'delete',
    getTitle: () => 'User Deleted',
    getDescription: (req) => `Deleted user name: ${req.body.name}`,
  }),
  UserControllers.deleteUserProfile,
)


export const UserRoutes = router;
