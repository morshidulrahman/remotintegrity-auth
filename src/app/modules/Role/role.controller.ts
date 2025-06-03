import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { RoleService } from './role.service';


// @desc    Create a new role
const createRole = catchAsync(async (req, res) => {
  const { roleName, note, modules  } = req.body;

  const payload = {
    roleName,
    note,
    modules,
  };

  const result = await RoleService.createRoleIntoDB(payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Role created successfully',
    data: result,
  });
});


// @desc    Get all roles
const getAllRoles = catchAsync(async (req, res) => {


  const result = await RoleService.getAllRoles(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All roles retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

// @desc    Get role by ID
const getRoleById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await RoleService.getRoleById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Role retrieved successfully',
    data: result,
  });
});

// @desc    Update role
const updateRole = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { roleName, note, modules } = req.body;

  const payload = {
    roleName,
    note,
    modules,
  };

  const result = await RoleService.updateRole(id, payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Role updated successfully',
    data: result,
  });
});

// @desc    Delete role
const deleteRole = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await RoleService.deleteRole(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Role deleted successfully',
    data: result,
  });
});


export const RoleControllers = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
};

