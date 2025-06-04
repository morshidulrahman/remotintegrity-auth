import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import { IUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';
import catchAsync from '../utils/catchAsync';

const auth = (...requiredRoles: IUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    //console.log('authHeader:', authHeader);

    // checking if the token is missing
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    // Extract the token from the header
    const token = authHeader.split(' ')[1]; // "Bearer <token>" -> Extract <token>

    // checking if the given token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const { role, userId } = decoded;

    // eslint-disable-next-line no-console

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
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked !!');
    }

    // if (
    //   user.passwordChangedAt &&
    //   User.isJWTIssuedBeforePasswordChanged(
    //     user.passwordChangedAt,
    //     iat as number,
    //   )
    // ) {
    //   throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
    // }

    // Main Logic: Check for role authorization
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    // Additional check for admin role - verify if user is a master admin
    // if (requiredRoles.includes('admin') && !user.isMasterAdmin) {
    //   throw new AppError(
    //     httpStatus.UNAUTHORIZED,
    //     'Admin access requires master admin privileges!',
    //   );
    // }

    // Optional: stricter admin role check ONLY if 'admin' is the ONLY allowed role
    if (
      requiredRoles.length === 1 &&
      requiredRoles.includes('masterAdmin') &&
      !user.isMasterAdmin
    ) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Admin access requires master admin privileges!',
      );
    }

    // Attach decoded information to the request object
    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
