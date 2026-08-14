const ActivityLog = require('../models/ActivityLog');

/**
 * Logs a user's activity to the database.
 * 
 * @param {ObjectId|String} userId - The ID of the user performing the action.
 * @param {String} action - The action type (e.g., 'LOGIN', 'CREATE_LISTING').
 * @param {Object} details - Additional metadata about the action (optional).
 */
const logActivity = async (userId, action, details = {}) => {
  try {
    await ActivityLog.create({
      user: userId,
      action,
      details
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
    // We intentionally don't throw an error here so that main business logic 
    // doesn't fail just because activity logging failed.
  }
};

module.exports = logActivity;
