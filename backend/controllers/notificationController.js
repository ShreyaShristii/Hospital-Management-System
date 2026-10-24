const Notification = require('../models/Notification');

// Add new notification
const addNotification = async (req, res, next) => {
  try {
    const { userId, title, message, type, priority, relatedEntity, relatedEntityId, actionUrl } = req.body;

    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      priority,
      relatedEntity,
      relatedEntityId,
      actionUrl
    });

    res.status(201).json({ message: 'Notification created successfully', notification });
  } catch (error) {
    next(error);
  }
};

// Get all notifications for user
const getUserNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id || req.params.userId;
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

// Get unread notifications for user
const getUnreadNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id || req.params.userId;
    const notifications = await Notification.find({ userId, isRead: false })
      .sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

// Get notification by ID
const getNotificationById = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json(notification);
  } catch (error) {
    next(error);
  }
};

// Mark notification as read
const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        isRead: true,
        readAt: Date.now()
      },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (error) {
    next(error);
  }
};

// Mark all notifications as read for user
const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id || req.params.userId;
    const result = await Notification.updateMany(
      { userId, isRead: false },
      {
        isRead: true,
        readAt: Date.now()
      }
    );

    res.status(200).json({ message: 'All notifications marked as read', modifiedCount: result.modifiedCount });
  } catch (error) {
    next(error);
  }
};

// Delete notification
const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Delete all notifications for user
const deleteAllNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id || req.params.userId;
    const result = await Notification.deleteMany({ userId });
    res.status(200).json({ message: 'All notifications deleted', deletedCount: result.deletedCount });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addNotification,
  getUserNotifications,
  getUnreadNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications
};
