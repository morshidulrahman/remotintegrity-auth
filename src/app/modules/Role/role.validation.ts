import { z } from 'zod';

const createRoleValidationSchema = z.object({
  body: z.object({
    roleName: z.string({
      required_error: 'Role name is required',
    }),
    note: z.string().optional(),
    modules: z.array(z.string()).optional(),
  }),
});

const updateRoleValidationSchema = z.object({
  body: z.object({
    roleName: z.string().optional(),
    note: z.string().optional(),
    modules: z.array(z.string()).optional(),
  }),
});

export const RoleValidations = {
  createRoleValidationSchema,
  updateRoleValidationSchema
};