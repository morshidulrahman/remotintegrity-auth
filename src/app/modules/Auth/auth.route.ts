import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AuthControllers } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = express.Router();

// TODO: add validation
router.post(
  '/login',
  AuthControllers.loginUser,
);


// router.post(
//   '/login',
//   validateRequest(AuthValidation.loginValidationSchema),
//   AuthControllers.loginUser,
// );

// router.post(
//   '/change-password',
//   auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
//   validateRequest(AuthValidation.changePasswordValidationSchema),
//   AuthControllers.changePassword,
// );

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

// change password
router.post(
  '/change-password',
  auth("user"),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthControllers.changePassword,
);

// reset password
router.post(
  '/reset-password',
  //validateRequest(AuthValidation.resetPasswordValidationSchema),
  AuthControllers.resetPassword,
);

// forgot password
router.post(
  '/forgot-password',
  //validateRequest(AuthValidation.forgotPasswordValidationSchema),
  AuthControllers.forgotPassword,
);

// verify email
router.post(
  '/verify-email',
  //validateRequest(AuthValidation.verifyEmailValidationSchema),
  AuthControllers.verifyEmail,
);

// resend email verification
router.post(
  '/send-verification-email',
  auth("user"),
  AuthControllers.sendVerificationEmail,
);


export const AuthRoutes = router;
