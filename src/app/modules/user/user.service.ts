/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */


import httpStatus from 'http-status';
import mongoose, { Types } from 'mongoose';
import config from '../../config';
import AppError from '../../errors/AppError';
import { IUser } from './user.interface';
import { User } from './user.model';
import { Role } from '../Role/role.model';
import QueryBuilder from '../../builder/QueryBuilder';


/**
 * Creates a new user in the database within a transaction.
 * @param username - Username of the user.
 * @param name - Name of the user.
 * @param email - Email of the user.
 * @param password - Password of the user (optional).
 * @param position - Position of the user.
 * @param division - Department of the user.
 * @param note
 * @param roleId
 * @param role
 * @param status
 * @param avatar
 * @returns The newly created user.
 * @throws AppError if user creation fails.
 */
const createUserIntoDB = async (
  username: string,
  name: string,
  email: string,
  password: string,
  position: string = '',
  division: string = '',
  note: string = '',
  roleId: typeof Types.ObjectId,
  role: string = 'user',
  status: string = 'active',
  avatar: string
): Promise<IUser> => {


  const userData: Partial<IUser> = {
    username,
    name,
    email,
    password: password || config.default_password as string,
    position,
    division,
    note,
    roleId,
    role : 'user',
    status : 'active',
    avatar,
  };

  //console.log('userData', userData);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      throw new AppError(httpStatus.CONFLICT, 'User with this email already exists');
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username }).session(session);
    if (existingUsername) {
      throw new AppError(httpStatus.CONFLICT, 'Username already exists');
    }

    // check roleId is valid
    const role = await Role.findById(roleId);
    if (!role) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid roleId');
    }

    // Create user within the transaction
    const [newUser] = await User.create([userData], { session });


    //console.log('newUser', newUser);

    if (!newUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    await session.commitTransaction();
    return newUser;
  } catch (error) {
    await session.abortTransaction();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'User creation failed');
  } finally {
    session.endSession();
  }

};



const getSingleUser = async (id: string): Promise<IUser | null> => {
  console.log('id', id);
  const user = await User.findById(id).select('-password');
  return user;
}

// get all users
const getAllUsers = async (query: Record<string, unknown>) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {

    // Define searchable fields for global search
    const searchableFields = ['username', 'name', 'email', 'position', 'division', 'note', 'role', 'status'];
    // Define which fields are numeric
    //const numericFields = ['phone', 'extension'];

    const userQuery = new QueryBuilder(User.find().select('-password'), query)
      .globalSearch(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

    const result = await userQuery.execute();

    return result;

    // const users = await User.find().select('-password');
    // return users;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
}

// update user
const updateUserProfile = async (id: string, payload: Partial<IUser>): Promise<IUser | null> => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findOneAndUpdate({ _id: id }, payload, {
      new: true,
      session,
    });
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }
    await session.commitTransaction();
    await session.endSession();
    return user;

  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};


// delete a user
const deleteUserProfile = async (id: string): Promise<IUser | null> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    await session.commitTransaction();
    return user;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};


// const createStudentIntoDB = async (password: string, payload: TStudent) => {
//   // create a user object
//   const userData: Partial<TUser> = {};
//
//   //if password is not given , use deafult password
//   userData.password = password || (config.default_password as string);
//
//   //set student role
//   userData.role = 'user';
//
//   // find academic semester info
//   // const admissionSemester = await AcademicSemester.findById(
//   //   payload.admissionSemester,
//   // );
//
//   // if (!admissionSemester) {
//   //   throw new AppError(400, 'Admission semester not found');
//   // }
//
//   const session = await mongoose.startSession();
//
//   try {
//     session.startTransaction();
//     //set  generated id
//     //userData.id = await generateStudentId(admissionSemester);
//
//     // create a user (transaction-1)
//     const newUser = await User.create([userData], { session }); // array
//
//     //create a student
//     // if (!newUser.length) {
//     //   throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
//     // }
//     // set id , _id as user
//     //payload.id = newUser[0].id;
//     //payload.user = newUser[0]._id; //reference _id
//
//     // create a student (transaction-2)
//
//     //const newStudent = await Student.create([payload], { session });
//
//     if (!newUser.length) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
//     }
//
//     await session.commitTransaction();
//     await session.endSession();
//
//     return newUser;
//   } catch (err: any) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw new Error(err);
//   }
// };

// const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
//   // create a user object
//   const userData: Partial<TUser> = {};
//
//   //if password is not given , use deafult password
//   userData.password = password || (config.default_password as string);
//
//   //set student role
//   userData.role = 'faculty';
//
//   // find academic department info
//   // const academicDepartment = await AcademicDepartment.findById(
//   //   payload.academicDepartment,
//   // );
//
//   // if (!academicDepartment) {
//   //   throw new AppError(400, 'Academic department not found');
//   // }
//
//   const session = await mongoose.startSession();
//
//   try {
//     session.startTransaction();
//     //set  generated id
//     userData.id = await generateFacultyId();
//
//     // create a user (transaction-1)
//     const newUser = await User.create([userData], { session }); // array
//
//     //create a faculty
//     if (!newUser.length) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
//     }
//     // set id , _id as user
//     payload.id = newUser[0].id;
//     payload.user = newUser[0]._id; //reference _id
//
//     // create a faculty (transaction-2)
//
//     const newFaculty = await Faculty.create([payload], { session });
//
//     if (!newFaculty.length) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty');
//     }
//
//     await session.commitTransaction();
//     await session.endSession();
//
//     return newFaculty;
//   } catch (err: any) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw new Error(err);
//   }
// };
//
// const createAdminIntoDB = async (password: string, payload: TAdmin) => {
//   // create a user object
//   const userData: Partial<TUser> = {};
//
//   //if password is not given , use deafult password
//   userData.password = password || (config.default_password as string);
//
//   //set student role
//   userData.role = 'admin';
//
//   const session = await mongoose.startSession();
//
//   try {
//     session.startTransaction();
//     //set  generated id
//     userData.id = await generateAdminId();
//
//     // create a user (transaction-1)
//     const newUser = await User.create([userData], { session });
//
//     //create a admin
//     if (!newUser.length) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
//     }
//     // set id , _id as user
//     payload.id = newUser[0].id;
//     payload.user = newUser[0]._id; //reference _id
//
//     // create a admin (transaction-2)
//     const newAdmin = await Admin.create([payload], { session });
//
//     if (!newAdmin.length) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
//     }
//
//     await session.commitTransaction();
//     await session.endSession();
//
//     return newAdmin;
//   } catch (err: any) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw new Error(err);
//   }
// };

export const UserServices = {
  createUserIntoDB,
  getSingleUser,
  getAllUsers,
  updateUserProfile,
  deleteUserProfile
};
