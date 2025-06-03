import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';



// @desc    Register user
const registerUser = catchAsync(async (req, res) => {

  const { username, name, email, password, position, division, note, roleId, role, status, avatar } = req.body;

  console.log(req.body);

  const result = await UserServices.createUserIntoDB( username, name, email, password, position, division, note, roleId, role, status, avatar );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is created successfully',
    data: result,
  });
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = catchAsync(async (req, res) => {

  //console.log(req.user)
  const result = await UserServices.getSingleUser(req.user.userId);

  //console.log(result);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User data retrieved successfully',
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'User not found',
    });
  }
});


// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private
const getAllUsers = catchAsync(async (req, res) => {

  const result = await UserServices.getAllUsers(req.query);
  if (result) {
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Users retrieved successfully',
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Users not found',
    });
  }
});


// @desc    Get user by ID
// @route   GET /api/auth/users/:id
// @access  Private
const getUserById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.getSingleUser(id);
  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User retrieved successfully',
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'User not found',
    });
  }
});



// @desc    Update user profile
// @route   PATCH /api/auth/profile
// @access  Private
const updateUserProfile = catchAsync(async (req, res) => {
  const { username, name, position, division, status, avatar} = req.body;

  const id = req.user.userId;
  const userData = {
    username,
    name,
    position,
    division,
    avatar,
    status,
  };

  console.log('userData', userData);

  const result = await UserServices.updateUserProfile(id, userData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile updated successfully',
    data: result,
  });
});


// @desc    Update user by ID
// @route   PATCH /api/auth/users/:id
// @access  Private
const updateUserById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { username, name, position, division, status, avatar, roleId, role, isMasterAdmin, isBlocked } = req.body;
    const userData = {
      username,
      name,
      position,
      division,
      avatar,
      status,
      roleId,
      role,
      isMasterAdmin,
      isBlocked,
    };
    console.log('userData', userData);
  const result = await UserServices.updateUserProfile(id, userData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile updated successfully',
    data: result,
  });
});



// @desc    Delete user profile
// @route   DELETE /api/auth/profile
// @access  Private
const deleteUserProfile = catchAsync(async (req, res) => {
  const result = await UserServices.deleteUserProfile(req.user.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile deleted successfully',
    data: result,
  });
});

//
// const createStudent = catchAsync(async (req, res) => {
//   const { password, student: studentData } = req.body;
//
//   //const result = await UserServices.createStudentIntoDB(password, studentData);
//
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Student is created succesfully',
//     data: result,
//   });
// });
//
// const createFaculty = catchAsync(async (req, res) => {
//   const { password, faculty: facultyData } = req.body;
//
//   const result = await UserServices.createFacultyIntoDB(password, facultyData);
//
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Faculty is created succesfully',
//     data: result,
//   });
// });
//
// const createAdmin = catchAsync(async (req, res) => {
//   const { password, admin: adminData } = req.body;
//
//   const result = await UserServices.createAdminIntoDB(password, adminData);
//
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Admin is created succesfully',
//     data: result,
//   });
// });

export const UserControllers = {
  registerUser,
  getUserProfile,
  getAllUsers,
  getUserById,
  updateUserProfile,
  updateUserById,
  deleteUserProfile
};
