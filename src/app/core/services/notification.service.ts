import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new Subject<Notification>();
  notifications$ = this.notifications.asObservable();

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  private show(type: Notification['type'], message: string, duration = 5000): void {
    const notification: Notification = {
      id: this.generateId(),
      type,
      message,
      duration,
    };
    this.notifications.next(notification);
  }

  success(message: string, duration?: number): void {
    this.show('success', message, duration);
  }

  error(message: string, duration?: number): void {
    this.show('error', message, duration);
  }

  warning(message: string, duration?: number): void {
    this.show('warning', message, duration);
  }

  info(message: string, duration?: number): void {
    this.show('info', message, duration);
  }
}
