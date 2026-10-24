import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNotifications, markAsRead, deleteNotification } from '../../features/notifications/notificationSlice';
import { useNavigate } from 'react-router-dom';
import './NotificationBell.css';

const NotificationBell = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, unreadCount } = useSelector(state => state.notifications);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch(getNotifications());
    const interval = setInterval(() => {
      dispatch(getNotifications());
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      dispatch(markAsRead(notification._id));
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      setShowDropdown(false);
    }
  };

  const handleDelete = (e, notificationId) => {
    e.stopPropagation();
    dispatch(deleteNotification(notificationId));
  };

  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      <button
        type="button"
        className="bell-icon-wrapper"
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
        aria-expanded={showDropdown}
        aria-haspopup="true"
        onClick={() => setShowDropdown(!showDropdown)}
        style={{ background: 'transparent', border: 'none', color: 'inherit', display: 'flex' }}
      >
        <svg
          className="bell-icon"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          aria-hidden="true"
        >
          <path
            d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-5h-1V10a6 6 0 1 0-12 0v7H5a1 1 0 0 0 0 2h14a1 1 0 1 0 0-2Z"
            fill="currentColor"
          />
        </svg>
        {unreadCount > 0 && <span className="badge" aria-hidden="true">{unreadCount}</span>}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="dropdown-header">
            <h3>Notifications</h3>
            <button 
              className="view-all-btn" 
              onClick={() => {
                navigate('/notifications');
                setShowDropdown(false);
              }}
            >
              View All
            </button>
          </div>

          <div className="notifications-list">
            {recentNotifications.length > 0 ? (
              recentNotifications.map(notification => (
                <div
                  key={notification._id}
                  className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleNotificationClick(notification) } }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">
                      {new Date(notification.createdAt).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                  <button
                    className="delete-btn"
                    aria-label={`Delete notification: ${notification.title}`}
                    onClick={(e) => handleDelete(e, notification._id)}
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-state">No notifications</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
