import { Router } from 'express';

import { AuthRoutes } from '../modules/Auth/auth.route';
import { UserRoutes } from '../modules/user/user.route';
import { RoleRoutes } from '../modules/Role/role.route';
import { ActivityRoutes } from '../modules/Activity/activity.route';

const router = Router();

const moduleRoutes = [
  { path: '/users', route: UserRoutes },
  { path: '/roles', route: RoleRoutes },

  { path: '/auth', route: AuthRoutes },

  { path: '/activity', route: ActivityRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
