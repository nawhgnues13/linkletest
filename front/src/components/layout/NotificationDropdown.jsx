import React, { useState, useEffect, useRef } from 'react';
import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { notificationApi } from '../../services/api/notificationApi';
import { useWebSocket } from '../../hooks/useWebSocket';

const NotificationDropdown = ({ memberId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  const handleNewNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  };

  useWebSocket(memberId, handleNewNotification);

  useEffect(() => {
    if (memberId) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [memberId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationApi.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('알림 목록 조회 실패:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const count = await notificationApi.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('읽지 않은 알림 개수 조회 실패:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationApi.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.notificationId === notificationId ? { ...n, isRead: 'Y' } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: 'Y' })));
      setUnreadCount(0);
    } catch (error) {
      console.error('전체 읽음 처리 실패:', error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await notificationApi.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n.notificationId !== notificationId));
      const deletedNotification = notifications.find((n) => n.notificationId === notificationId);
      if (deletedNotification && deletedNotification.isRead === 'N') {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('알림 삭제 실패:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.isRead === 'N') {
      handleMarkAsRead(notification.notificationId);
    }
    if (notification.linkUrl) {
      window.location.href = notification.linkUrl;
    }
    setIsOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return '방금 전';
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;

    return date.toLocaleDateString('ko-KR');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-gray-700 hover:text-primary transition-colors"
        aria-label="알림"
      >
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">알림</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-primary hover:text-primary-dark"
              >
                모두 읽음
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">알림이 없습니다</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.notificationId}
                  className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                    notification.isRead === 'N' ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                      <p className="text-gray-600 text-sm mt-1">{notification.content}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {formatDate(notification.sentAt)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification.notificationId);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
