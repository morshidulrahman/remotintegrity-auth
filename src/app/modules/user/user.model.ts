/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../config';
import { IUser, UserModel } from './user.interface';


const userSchema = new Schema<IUser, UserModel>(
  {
    username: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    position: { type: String, default: '' },
    division: { type: String, default: '' },
    avatar: {
      type: String,
      default: 'https://t3.ftcdn.net/jpg/09/48/12/66/360_F_948126611_dW8FoEoBueaztnxa3SKEjoZt8djvPGhT.jpg',
    },
    note: { type: String, default: '' },
    roleId: { type: Schema.Types.ObjectId, ref: 'Role' },
    role: {
      type: String,
      enum: ['user', 'client', 'riuser', 'masterAdmin' ],
      default: 'user',
    },
    status: { type: String, enum: ['active', 'inactive', 'onLeave'], default: 'active' },
    isMasterAdmin: { type: Boolean, default: false },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: { type: Date},
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    needsPasswordChange: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  },
);


// Hash password before saving

userSchema.pre<IUser>('save', async function (next) {


  if (!this.isModified('password')) {
    return next();
  }

  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // doc
  // hashing password and save into DB

  try {
    user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
  }
  catch (error) {
    return next(error as any);
  }
});

// set '' after saving password
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  return await User.findOne({ id }).select('+password');
};


// check if password is matched
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};


// check if the password is changed after the jwt issued
userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<IUser, UserModel>('User', userSchema);
