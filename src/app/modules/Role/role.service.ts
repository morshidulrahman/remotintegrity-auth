import mongoose from 'mongoose';
import { TRole } from './role.interface';
import { Role } from './role.model';
import QueryBuilder from '../../builder/QueryBuilder';


const createRoleIntoDB = async (payload: TRole): Promise<TRole | null> => {

  const roleData: Partial<TRole> = payload;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [result] = await Role.create([roleData], { session });
    if (!result) {
      throw new Error('Failed to create role');
    }


    await session.commitTransaction();
    await session.endSession();

    return result.toObject();

  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

// get all roles
const getAllRoles = async (query: Record<string, unknown>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    // Define searchable fields for global search
    const searchableFields = ['roleName', 'note', ];
    // Define which fields are numeric
    //const numericFields = ['phone', 'extension'];

    const roleQuery = new QueryBuilder(Role.find(), query)
      .globalSearch(searchableFields)
      .filter()
      .sort()
      .paginate()
      .fields();

    const result = await roleQuery.execute();

    if (!result) {
      throw new Error('Failed to retrieve roles');
    }
    await session.commitTransaction();
    await session.endSession();
    return result;

  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};



// get role by id
const getRoleById = async (id: string): Promise<TRole | null> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const role = await Role.findById(id).session(session);

    if (!role) {
      throw new Error('Role not found');
    }

    await session.commitTransaction();
    await session.endSession();
    return role.toObject();

    } catch (error) {
    await session.abortTransaction();
    throw error;
    } finally {
      await session.endSession();
  }
};


// Update role
const updateRole = async (id: string, payload: TRole): Promise<TRole | null> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const updatedRole = await Role.findByIdAndUpdate(id, payload, { new: true, session });
    if (!updatedRole) {
      throw new Error('Role not found');
    }
    await session.commitTransaction();
    await session.endSession();
    return updatedRole.toObject();

  }catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
}

// Delete role
const deleteRole = async (id: string): Promise<TRole | null> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    //const deletedRole = await Role.findByIdAndDelete(id, { session });

    // soft delete
    const deletedRole = await Role.findByIdAndUpdate(id, { isDeleted: true }, { new: true, session });

    if (!deletedRole) {
      throw new Error('Role not found');
    }
    await session.commitTransaction();
    await session.endSession();
    return deletedRole.toObject();

  } catch (error) {
  await session.abortTransaction();
  throw error;
  } finally {
    await session.endSession();
  }
};



export const RoleService = {
  createRoleIntoDB,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
}