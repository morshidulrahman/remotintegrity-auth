import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserControllers } from './user.controller';
import { UserValidation } from './user.validation';

const router = express.Router();

// Register a new user
router.post(
  '/register',
  validateRequest(UserValidation.userValidationSchema),

  UserControllers.registerUser,
);

// Get User
router.get(
  '/profile',
  auth('user', 'client', 'riuser', 'masterAdmin'),
  UserControllers.getUserProfile,
);

// Get All User
router.get(
  '/',
  auth('user', 'client', 'riuser', 'masterAdmin'),
  UserControllers.getAllUsers,
);

// Get Single User
router.get(
  '/:id',
  auth('user', 'client', 'riuser', 'masterAdmin'),
  UserControllers.getUserById,
);

// Update User
router.patch(
  '/profile',
  auth('user', 'client', 'riuser', 'masterAdmin'),
  validateRequest(UserValidation.updateUserValidationSchema),

  UserControllers.updateUserProfile,
);

// Update User by ID
router.patch(
  '/:id',
  auth('user', 'client', 'riuser', 'masterAdmin'),
  validateRequest(UserValidation.updateUserValidationSchema),

  UserControllers.updateUserById,
);

// Delete User
router.delete(
  '/profile',
  auth('user', 'client', 'riuser', 'masterAdmin'),

  UserControllers.deleteUserProfile,
);

export const UserRoutes = router;
