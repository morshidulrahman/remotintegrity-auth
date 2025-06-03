import { Types } from 'mongoose';
import { NotificationService } from '../modules/Notification/notification.service';

// Middleware to create notifications
const createNotification = async (
    userId: number,
    senderId: Types.ObjectId,
    message: string,
    type: 'task' | 'message' | 'comment' | 'update',
    link: string
) => {
    try {
        const notificationData = {
            userId,
            senderId,
            message,
            type,
            link,
            isRead: false,
            isDeleted: false
        };
        console.log('Notification data from Middleware:', notificationData);

        await NotificationService.createNotification(notificationData);
        return true;
    } catch (error) {
        console.error('Error creating notification:', error);
        return false;
    }
};

// Task assignment notification
const taskAssignedNotification = async (
    taskId:  string,
    taskTitle: string,
    assigneeId: number,
    assignerId: Types.ObjectId
) => {
    const message = `You have been assigned a new task: ${taskTitle}`;
    const link = `/tasks?taskId=${taskId}`;
    //const link = `/tasks`;

    return await createNotification(assigneeId, assignerId, message, 'task', link);
};

// Task status update notification
const taskStatusUpdateNotification = async (
    taskId: string,
    taskTitle: string,
    assigneeId: number,
    updaterId: Types.ObjectId,
    newStatus: string
) => {
    const message = `Task "${taskTitle}" status has been updated to ${newStatus}`;
    //const link = `/tasks/${taskId}`;
    //const link = `/tasks`;
    const link = `/tasks?taskId=${taskId}`;
    console.log('Notification data from Middleware:', message);
    return await createNotification(assigneeId, updaterId, message, 'update', link);
};

// New comment notification
const newCommentNotification = async (
    taskId: string,
    taskTitle: string,
    receiverId: number,
    commenterId: Types.ObjectId
) => {
    const message = `New comment on task: ${taskTitle}`;
    //const link = `/tasks/${taskId}#comments`;
    const link = `/tasks`;
    return await createNotification(receiverId, commenterId, message, 'comment', link);
};

// Project assignment notification
const projectAssignmentNotification = async (
    projectId: string,
    projectName: string,
    memberId: number,
    assignerId: Types.ObjectId
) => {
    const message = `You have been added to project: ${projectName}`;
    //const link = `/projects/${projectId}`;
    const link = `/projects`;
    return await createNotification(memberId, assignerId, message, 'update', link);
};

export const NotificationMiddleware = {
    createNotification,
    taskAssignedNotification,
    taskStatusUpdateNotification,
    newCommentNotification,
    projectAssignmentNotification
};
