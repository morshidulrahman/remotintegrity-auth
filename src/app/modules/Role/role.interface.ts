import { Model, Types } from 'mongoose';


export type TRole = {
  _id?: typeof Types.ObjectId;
  roleName: string;
  note?: string;
  modules: string[];
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  createdByUser?: typeof Types.ObjectId;
  updatedByUser?: typeof Types.ObjectId;
  deletedByUser?: typeof Types.ObjectId;
};

export interface RoleModel extends Model<TRole> {
  // eslint-disable-next-line no-unused-vars
  isUserExists(id: string): Promise<TRole | null>;
}


