import cron from 'node-cron';
import { ActivityService } from './activity.service';
import { DEFAULT_ACTIVITY_CLEANUP_DAYS } from './activity.constants';

// Run cleanup job every day at 2 AM
export const scheduleActivityCleanup = () => {
  cron.schedule('0 2 * * *', async () => {
    try {
      console.log('Starting activity cleanup job...');
      const deletedCount = await ActivityService.cleanupOldActivities(DEFAULT_ACTIVITY_CLEANUP_DAYS);
      console.log(`Activity cleanup completed. Removed ${deletedCount} old activities.`);
    } catch (error) {
      console.error('Activity cleanup job failed:', error);
    }
  });
};

// Generate daily activity summary (optional)
export const scheduleDailyActivitySummary = () => {
  cron.schedule('0 23 * * *', async () => {
    try {
      console.log('Generating daily activity summary...');
      // Implementation for daily summary generation
      // This could send emails, create reports, etc.
    } catch (error) {
      console.error('Daily activity summary job failed:', error);
    }
  });
};
