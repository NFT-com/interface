import { NotificationContext } from './NotificationContext';

import { useContext } from 'react';

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationContextProvider');
  }
  return context;
}