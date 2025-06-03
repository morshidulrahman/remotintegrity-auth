import { z } from 'zod';

const userValidationSchema = z.object({
  body: z.object({
    username: z.string().optional(),
    name: z.string({
      required_error: 'Name is required',
    }),
    email: z.string({
      required_error: 'Email is required',
    }),
    password: z.string({
      required_error: 'Password is required',})
      .min(6, { message: 'Password must be at least 6 characters' })
      .max(20, { message: 'Password can not be more than 20 characters' }),
      // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      //   message:
      //     'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      // })
    position: z.string({
      required_error: 'Position is required',
    }).optional(),
    division: z.string({
      required_error: 'Department is required',
    }).optional(),
    avatar: z.string().optional(),
    status: z.string().optional(),
    note: z.string().optional(),
    roleId: z.string({
      required_error: 'Role is required',
    }).optional(),
  })
});

const updateUserValidationSchema = z.object({
  body: z.object({
    userName: z.string().optional(),
    name: z.string().optional(),
    position: z.string().optional(),
    division: z.string().optional(),
    avatar: z.string().optional(),
    note: z.string().optional(),
    status: z.string().optional(),
    roleId: z.string().optional(),
  }),
});

export const UserValidation = {
  userValidationSchema,
  updateUserValidationSchema
};
