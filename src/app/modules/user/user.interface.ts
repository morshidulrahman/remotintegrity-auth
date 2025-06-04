/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */

import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface IUser extends Document {
  username?: string;
  name: string;
  email: string;
  password: string;
  position?: string;
  division?: string;
  avatar?: string;
  roleId: typeof Types.ObjectId;
  role: 'user' | 'client' | 'riuser' | 'masterAdmin';
  status?: 'active' | 'inactive' | 'onLeave';
  note?: string;
  isMasterAdmin?: boolean;
  isDeleted: boolean;
  isBlocked: boolean;
  passwordChangedAt?: Date;
  needsPasswordChange: boolean;
  isEmailVerified: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface UserModel extends Model<IUser> {
  //instance methods for checking if the user exist
  isUserExistsByCustomId(id: string): Promise<IUser>;
  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type IUserRole = keyof typeof USER_ROLE;
