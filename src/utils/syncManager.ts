import { ref, get, set } from 'firebase/database';
import { db } from '@/config/firebase';

interface PendingChange {
  path: string;
  data: any;
  timestamp: number;
  type: 'update' | 'delete';
}

class SyncManager {
  private static instance: SyncManager;
  private pendingChanges: PendingChange[] = [];
  private isOnline: boolean = navigator.onLine;

  private constructor() {
    this.setupListeners();
    this.loadPendingChanges();
  }

  static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  private setupListeners() {
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private async handleOnline() {
    this.isOnline = true;
    await this.syncPendingChanges();
  }

  private loadPendingChanges() {
    const saved = localStorage.getItem('pendingChanges');
    if (saved) {
      this.pendingChanges = JSON.parse(saved);
    }
  }

  private savePendingChanges() {
    localStorage.setItem('pendingChanges', JSON.stringify(this.pendingChanges));
  }

  async queueChange(path: string, data: any, type: 'update' | 'delete') {
    const change: PendingChange = {
      path,
      data,
      timestamp: Date.now(),
      type
    };
    
    this.pendingChanges.push(change);
    this.savePendingChanges();

    if (this.isOnline) {
      await this.syncPendingChanges();
    }
  }

  private async syncPendingChanges() {
    if (!this.pendingChanges.length) return;

    const changes = [...this.pendingChanges];
    this.pendingChanges = [];
    this.savePendingChanges();

    for (const change of changes) {
      try {
        const dbRef = ref(db, change.path);
        if (change.type === 'update') {
          await set(dbRef, change.data);
        } else if (change.type === 'delete') {
          await set(dbRef, null);
        }
      } catch (error) {
        console.error('Error syncing change:', error);
        // Re-queue failed changes
        this.pendingChanges.push(change);
        this.savePendingChanges();
      }
    }
  }
}

export const syncManager = SyncManager.getInstance(); 