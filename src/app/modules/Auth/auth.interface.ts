export type TLoginUser = {
  email: string;
  password: string;
};

// Interface for Role
export interface IRole {
  _id: string;
  roleName: string;
  modules: string[];
}

// Interface for User
export interface AuthUser {
  userId: string;
  username: string;
  name: string;
  email: string;
  position: string;
  division: string;
  avatar: string;
  roleId: IRole;
  status: string;
  role: string;
  isMasterAdmin: boolean;
  isDeleted: boolean;
  isBlocked: boolean;
  needsPasswordChange: boolean;
  isEmailVerified: boolean;
}
