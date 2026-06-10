import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  show(message: string, duration = 3000) {
    try {
      const el = document.createElement('div');
      el.textContent = message;
      el.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.85);color:#fff;padding:10px 14px;border-radius:8px;z-index:10000;font-size:14px;';
      document.body.appendChild(el);
      // Fade out
      setTimeout(() => {
        el.style.transition = 'opacity 300ms';
        el.style.opacity = '0';
      }, duration - 300);
      setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, duration);
    } catch (e) {
      // Fallback to alert if DOM manipulation fails
      console.warn('Notification failed, falling back to alert.', e);
      alert(message);
    }
  }
}
