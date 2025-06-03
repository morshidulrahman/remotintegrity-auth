export const ACTIVITY_MODULES = [
  'user',
  'company',
  'contact',
  'project',
  'task',
  'role',
  'bundle',
  'board',
  'position',
  'pboard',
  'employee',
  'activity',
] as const;

export const ACTIVITY_TYPES = ['create', 'update', 'delete'] as const;

export const ACTIVITY_SEARCHABLE_FIELDS = [
  'ActivityTitle',
  'description',
  'module',
  'type',
];

export const ACTIVITY_FILTERABLE_FIELDS = [
  'userId',
  'type',
  'module',
  'date',
  'isDeleted',
];

export const DEFAULT_ACTIVITY_CLEANUP_DAYS = 90;

export const ACTIVITY_PAGINATION_DEFAULTS = {
  page: 1,
  limit: 10,
  maxLimit: 100,
};

export const MODULE_DISPLAY_NAMES = {
  user: 'User Management',
  company: 'Company',
  contact: 'Contact',
  project: 'Project',
  task: 'Task',
  role: 'Role Management',
  bundle: 'Bundle',
  board: 'Board',
  position: 'Position',
  pboard: 'Project Board',
  employee: 'Employee',
  activity: 'Activity Log',
} as const;

export const ACTION_DISPLAY_NAMES = {
  create: 'Created',
  update: 'Updated',
  delete: 'Deleted',
} as const;
