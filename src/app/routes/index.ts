import { Router } from 'express';

import { AuthRoutes } from '../modules/Auth/auth.route';
import { UserRoutes } from '../modules/user/user.route';
import { RoleRoutes } from '../modules/Role/role.route';

const router = Router();

const moduleRoutes = [
  { path: '/users', route: UserRoutes },
  { path: '/roles', route: RoleRoutes },

  { path: '/auth', route: AuthRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
