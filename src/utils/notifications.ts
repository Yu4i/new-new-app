export class NotificationManager {
  private static instance: NotificationManager;
  private permission: NotificationPermission = 'default';

  private constructor() {
    this.init();
  }

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  private async init() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    this.permission = Notification.permission;
    if (this.permission === 'default') {
      await this.requestPermission();
    }
  }

  async requestPermission(): Promise<boolean> {
    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  async showNotification(title: string, options: NotificationOptions = {}) {
    if (!('Notification' in window)) return;

    if (this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) return;
    }

    const defaultOptions: NotificationOptions = {
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [200, 100, 200],
      ...options
    };

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, defaultOptions);
    } catch (error) {
      console.error('Error showing notification:', error);
      // Fallback to regular notification if service worker is not available
      new Notification(title, defaultOptions);
    }
  }
}

export const notificationManager = NotificationManager.getInstance(); 