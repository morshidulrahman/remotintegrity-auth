import httpStatus from 'http-status';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const payload = {
    email,
    password,
  };
  const result = await AuthServices.loginUser(payload);

  const {user, token, refreshToken, accessToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in successfully!',
    data: {
      _id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      position: user.position,
      division: user.division,
      avatar: user.avatar,
      roleId: user.roleId,
      status: user.status,
      role: user.role,
      isMasterAdmin: user.isMasterAdmin,
      isDeleted: user.isDeleted,
      isBlocked: user.isBlocked,
      passwordChangedAt: user.passwordChangedAt,
      needsPasswordChange: user.needsPasswordChange,
      isEmailVerified: user.isEmailVerified,
      token,
      accessToken,
    },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;

  const result = await AuthServices.changePassword(req.user, passwordData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password is updated successfully!',
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  console.log(refreshToken);
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved successfully!',
    data: result,
  });
});

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await AuthServices.forgotPassword(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset link is sent to your email!',
    data: result,
  });
});

// @desc    Reset password with token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = catchAsync(async (req, res) => {
  const { email, newPassword, token } = req.body;
  const result = await AuthServices.resetPassword({ email, newPassword, token });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset successful!',
    data: result,
  });
});

// @desc    Verify email with token
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = catchAsync(async (req, res) => {
  const { token } = req.body;
  const result = await AuthServices.verifyEmail(token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Email is verified successfully!',
    data: result,
  });
});

// @desc    Send verification email
// @route   POST /api/auth/send-verification-email
// @access  Private
const sendVerificationEmail = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await AuthServices.sendVerificationEmail(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Verification email sent successfully!',
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  changePassword,
  refreshToken,
  resetPassword,
  forgotPassword,
  verifyEmail,
  sendVerificationEmail
};
