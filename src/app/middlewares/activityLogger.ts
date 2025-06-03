import { Request, Response, NextFunction } from 'express';
import { ActivityService } from '../modules/Activity/activity.service';
import { Types } from 'mongoose';
import {
  createActivityLog,
  generateActivityTitle,
  generateActivityDescription
} from '../modules/Activity/activity.utils';

interface ActivityLoggerOptions {
  module: 'user' | 'company' | 'contact' | 'project' | 'task' | 'role' | 'bundle' | 'board' | 'position' | 'pboard' | 'employee' | 'activity';
  action?: 'create' | 'update' | 'delete';
  getTitle?: (req: Request, res: Response, responseBody?: any) => string;
  getDescription?: (req: Request, res: Response, responseBody?: any) => string;
  getResourceName?: (req: Request, res: Response, responseBody?: any) => string;
  skipCondition?: (req: Request, res: Response, responseBody?: any) => boolean;
}

const activityLogger = (options: ActivityLoggerOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Store original res.json to intercept response
    const originalJson = res.json;

    res.json = function (body: any) {
      // Log activity after successful operation
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Don't await to avoid blocking response
        logActivity(req, res, body, options).catch(error => {
          console.error('Activity logging failed:', error);
        });
      }
      return originalJson.call(this, body);
    };

    next();
  };
};

const logActivity = async (
  req: Request,
  res: Response,
  responseBody: any,
  options: ActivityLoggerOptions
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      console.warn('No user ID found for activity logging');
      return;
    }

    // Skip logging if condition is met
    if (options.skipCondition && options.skipCondition(req, res, responseBody)) {
      return;
    }

    const action = options.action || getActionFromMethod(req.method);
    const resourceName = options.getResourceName ? options.getResourceName(req, res, responseBody) : undefined;

    const title = options.getTitle
      ? options.getTitle(req, res, responseBody)
      : generateActivityTitle(action, options.module, resourceName);

    const description = options.getDescription
      ? options.getDescription(req, res, responseBody)
      : generateActivityDescription(action, options.module, req.params.id, resourceName);

    const activityData = createActivityLog(
      new Types.ObjectId(userId),
      options.module,
      action,
      title,
      description,
      req.originalUrl
    );

    await ActivityService.logActivity(activityData);
  } catch (error) {
    console.error('Activity logging failed:', error);
  }
};

const getActionFromMethod = (method: string): 'create' | 'update' | 'delete' => {
  switch (method.toUpperCase()) {
    case 'POST':
      return 'create';
    case 'PUT':
    case 'PATCH':
      return 'update';
    case 'DELETE':
      return 'delete';
    default:
      return 'update';
  }
};

// Bulk activity logger for operations that affect multiple resources
const bulkActivityLogger = (options: ActivityLoggerOptions & {
  getAffectedResources: (req: Request, res: Response, responseBody?: any) => Array<{id: string, name?: string}>
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json;

    res.json = function (body: any) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        logBulkActivity(req, res, body, options).catch(error => {
          console.error('Bulk activity logging failed:', error);
        });
      }
      return originalJson.call(this, body);
    };

    next();
  };
};

const logBulkActivity = async (
  req: Request,
  res: Response,
  responseBody: any,
  options: ActivityLoggerOptions & {
    getAffectedResources: (req: Request, res: Response, responseBody?: any) => Array<{id: string, name?: string}>
  }
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return;

    const affectedResources = options.getAffectedResources(req, res, responseBody);
    const action = options.action || getActionFromMethod(req.method);

    const activities = affectedResources.map(resource => {
      const title = options.getTitle
        ? options.getTitle(req, res, responseBody)
        : generateActivityTitle(action, options.module, resource.name);

      const description = options.getDescription
        ? options.getDescription(req, res, responseBody)
        : generateActivityDescription(action, options.module, resource.id, resource.name);

      return createActivityLog(
        new Types.ObjectId(userId),
        options.module,
        action,
        title,
        description,
        req.originalUrl
      );
    });

    if (activities.length > 0) {
      await ActivityService.createBulkActivities(activities);
    }
  } catch (error) {
    console.error('Bulk activity logging failed:', error);
  }
};

export default activityLogger;
export { bulkActivityLogger };
