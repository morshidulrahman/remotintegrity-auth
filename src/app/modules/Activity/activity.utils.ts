import { Types } from 'mongoose';
import { TCreateActivity } from './activity.interface';

export const createActivityLog = (
  userId: Types.ObjectId,
  module: TCreateActivity['module'],
  type: TCreateActivity['type'],
  title: string,
  description: string,
  link?: string
): TCreateActivity => {
  return {
    userId,
    ActivityTitle: title,
    type,
    module,
    description,
    link: link || '',
    time: new Date().toLocaleTimeString(),
  };
};

export const getModuleDisplayName = (module: string): string => {
  const moduleNames: Record<string, string> = {
    user: 'User',
    company: 'Company',
    contact: 'Contact',
    project: 'Project',
    task: 'Task',
    role: 'Role',
    bundle: 'Bundle',
    board: 'Board',
    position: 'Position',
    pboard: 'Project Board',
    employee: 'Employee',
    activity: 'Activity',
  };
  return moduleNames[module] || module;
};

export const getActionDisplayName = (action: string): string => {
  const actionNames: Record<string, string> = {
    create: 'Created',
    update: 'Updated',
    delete: 'Deleted',
  };
  return actionNames[action] || action;
};

export const generateActivityTitle = (action: string, module: string, resourceName?: string): string => {
  const actionName = getActionDisplayName(action);
  const moduleName = getModuleDisplayName(module);

  if (resourceName) {
    return `${actionName} ${moduleName}: ${resourceName}`;
  }
  return `${actionName} ${moduleName}`;
};

export const generateActivityDescription = (
  action: string,
  module: string,
  resourceId?: string,
  resourceName?: string,
  additionalInfo?: string
): string => {
  const actionName = getActionDisplayName(action);
  const moduleName = getModuleDisplayName(module);

  let description = `${actionName} ${moduleName.toLowerCase()}`;

  if (resourceName) {
    description += ` "${resourceName}"`;
  } else if (resourceId) {
    description += ` with ID: ${resourceId}`;
  }

  if (additionalInfo) {
    description += `. ${additionalInfo}`;
  }

  return description;
};
