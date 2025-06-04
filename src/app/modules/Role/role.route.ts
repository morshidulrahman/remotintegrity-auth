import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { RoleControllers } from './role.controller';
import { RoleValidations } from './role.validation';

const router = express.Router();

// Create a new role
router.post(
  '/',
  // auth('user', 'client', 'riuser', 'masterAdmin' ),
  validateRequest(RoleValidations.createRoleValidationSchema),
  RoleControllers.createRole,
);

// Get all roles
router.get(
  '/',
  // auth('user', 'client', 'riuser', 'masterAdmin'),
  RoleControllers.getAllRoles,
);

// Get role by ID
router.get(
  '/:id',
  auth('user', 'client', 'riuser', 'masterAdmin'),
  RoleControllers.getRoleById,
);

// Update role
router.patch(
  '/:id',
  auth('user', 'client', 'riuser', 'masterAdmin'),
  validateRequest(RoleValidations.updateRoleValidationSchema),
  RoleControllers.updateRole,
);

// Delete role
router.delete(
  '/:id',
  auth('user', 'client', 'riuser', 'masterAdmin'),
  RoleControllers.deleteRole,
);

export const RoleRoutes = router;
