import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import config from '../../config';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import { createToken, generateToken } from './auth.utils';

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: config.email_host as string,
  port: Number(config.email_port),
  secure: true, // use TLS
  auth: {
    user: config.email_user as string,
    pass: config.email_password as string,
  },
});

// Helper function to send emails
const sendEmail = async (to: string, subject: string, html: string) => {
  const mailOptions = {
    from: `"YouRI" <${config.email_from}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to send email',
    );
  }
};

/**
 * Logs in a user by verifying credentials and generating access/refresh tokens.
 * @param payload - The login credentials containing user Email and password.
 * @returns An object containing accessToken, refreshToken, and password change status.
 * @throws AppError if login fails due to invalid credentials or user status.
 */
const loginUser = async (payload: TLoginUser) => {
  const { email, password } = payload;

  // Check if the user exists
  //const user = await User.findOne({ email });
  const user = await User.findOne({ email }).populate({
    path: 'roleId',
    select: 'roleName modules',
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if the user is deleted
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is deleted');
  }

  // Check if the user is blocked
  if (user.isBlocked === true) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
  }

  // Validate password
  const isPasswordValid = await User.isPasswordMatched(password, user.password);
  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Incorrect password');
  }

  // Generate JWT tokens
  const jwtPayload = {
    userId: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    position: user.position,
    division: user.division,
    avatar: user.avatar,
    roleId: user.roleId,
    status: user.status,
    isMasterAdmin: user.isMasterAdmin,
    isDeleted: user.isDeleted,
    isBlocked: user.isBlocked,
    needsPasswordChange: user.needsPasswordChange,
    isEmailVerified: user.isEmailVerified,
  };

  const token = generateToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    user: user,
    token: token,
    accessToken,
    refreshToken,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // checking if the user is existed
  const user = await User.findById(userData.userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.isBlocked;
  if (userStatus === true) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  //checking if the password is correct
  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  console.log(newHashedPassword);

  // Fix: Use _id instead of id and add { new: true } to return the updated document
  const result = await User.findByIdAndUpdate(
    userData.userId,
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
    { new: true },
  );

  console.log(result);

  return result;
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  const { userId, iat } = decoded;

  // checking if the user is exist
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.isBlocked;

  if (userStatus === true) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
  }

  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (email: string) => {
  // Find the user
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if the user is deleted
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is deleted');
  }

  // Check if the user is blocked
  if (user.isBlocked === true) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
  }

  // Generate reset token
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_reset_password_secret as string,
    config.jwt_reset_password_expires_in as string,
  );

  // Create reset URL
  const resetUrl = `${config.client_url}/reset-password?token=${resetToken}&email=${email}`;

  // Create email content
  const emailSubject = 'Password Reset Request';
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>Hello ${user.name},</p>
      <p>We received a request to reset your password. Please click the button below to create a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
      </div>
      <p>This link will expire in 15 minutes.</p>
      <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
      <p>Thank you,<br>The YouRI Team</p>
    </div>
  `;

  // Send email
  await sendEmail(email, emailSubject, emailHtml);

  return {
    message: 'Password reset link has been sent to your email',
    // Don't send the token in production, this is just for development
    ...(config.NODE_ENV === 'development' && { resetToken, resetUrl }),
  };
};

// @desc    resetPassword
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (payload: {
  email: string;
  newPassword: string;
  token: string;
}) => {
  const { email, newPassword, token } = payload;

  // Verify the reset token
  let decoded;
  try {
    decoded = jwt.verify(
      token,
      config.jwt_reset_password_secret as string,
    ) as JwtPayload;
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token');
  }

  // Check if the token is for the correct user
  if (decoded.email !== email) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Token does not match user email',
    );
  }

  // Find the user
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if the user is deleted
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is deleted');
  }

  // Check if the user is blocked
  if (user.isBlocked === true) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  // Update the user's password
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      password: hashedPassword,
      passwordChangedAt: new Date(),
      needsPasswordChange: false,
    },
    { new: true },
  );

  if (!updatedUser) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update password',
    );
  }

  // Send confirmation email
  const emailSubject = 'Password Reset Successful';
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #333;">Password Reset Successful</h2>
      <p>Hello ${user.name},</p>
      <p>Your password has been successfully reset.</p>
      <p>If you did not initiate this password change, please contact our support team immediately.</p>
      <p>Thank you,<br>The YouRI Team</p>
    </div>
  `;

  await sendEmail(email, emailSubject, emailHtml);

  return {
    message: 'Password reset successful',
  };
};

// @desc    Verify user email
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = async (token: string) => {
  // Verify the token
  let decoded;
  try {
    decoded = jwt.verify(
      token,
      config.jwt_verify_email_secret as string,
    ) as JwtPayload;
  } catch (error) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Invalid or expired verification token',
    );
  }

  const { userId } = decoded;

  // Find the user
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if the user is already verified
  if (user.isEmailVerified) {
    return {
      message: 'Email already verified',
    };
  }

  // Check if the user is deleted
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is deleted');
  }

  // Check if the user is blocked
  if (user.isBlocked === true) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
  }

  // Update user's email verification status
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    },
    { new: true },
  );

  if (!updatedUser) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to verify email',
    );
  }

  // Send confirmation email
  const emailSubject = 'Email Verification Successful';
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #333;">Email Verification Successful</h2>
      <p>Hello ${user.name},</p>
      <p>Your email has been successfully verified. You now have full access to all features of YouRI.</p>
      <p>Thank you,<br>The YouRI Team</p>
    </div>
  `;

  await sendEmail(user.email, emailSubject, emailHtml);

  return {
    message: 'Email verified successfully',
  };
};

// @desc    Send verification email
// @route   POST /api/auth/send-verification-email
// @access  Private
const sendVerificationEmail = async (userId: string) => {
  // Find the user
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if the user is already verified
  if (user.isEmailVerified) {
    return {
      message: 'Email already verified',
    };
  }

  // Check if the user is deleted
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is deleted');
  }

  // Check if the user is blocked
  if (user.isBlocked === true) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
  }

  // Generate verification token
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const verificationToken = createToken(
    jwtPayload,
    config.jwt_verify_email_secret as string,
    config.jwt_verify_email_expires_in as string,
  );

  // Create verification URL
  const verificationUrl = `${config.client_url}/verify-email?token=${verificationToken}`;

  // Create email content
  const emailSubject = 'Verify Your Email Address';
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #333;">Verify Your Email Address</h2>
      <p>Hello ${user.name},</p>
      <p>Thank you for registering with YouRI. Please click the button below to verify your email address:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a>
      </div>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account with us, please ignore this email.</p>
      <p>Thank you,<br>The YouRI Team</p>
    </div>
  `;

  // Send email
  await sendEmail(user.email, emailSubject, emailHtml);

  return {
    message: 'Verification email sent successfully',
    // Don't send the token in production, this is just for development
    ...(config.NODE_ENV === 'development' && {
      verificationToken,
      verificationUrl,
    }),
  };
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  resetPassword,
  forgotPassword,
  verifyEmail,
  sendVerificationEmail,
};
