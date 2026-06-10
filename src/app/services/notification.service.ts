import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  
  show(message: string, type: 'success' | 'error' = 'success', duration = 3000) {
    try {
      const el = document.createElement('div');
      el.textContent = message;

      // Устанавливаем цвета: зеленый для успеха, красный для ошибки
      const bgColor = type === 'error' ? '#d32f2f' : '#388e3c';
      
      el.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${bgColor};
        color: #fff;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 10000;
        font-family: 'Montserrat', sans-serif;
        font-weight: 500;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        opacity: 0;
        transition: opacity 0.3s ease;
      `;

      document.body.appendChild(el);

      // Плавное появление
      setTimeout(() => el.style.opacity = '1', 10);

      // Плавное исчезновение
      setTimeout(() => {
        el.style.opacity = '0';
        setTimeout(() => {
          if (el.parentNode) el.parentNode.removeChild(el);
        }, 300);
      }, duration);

    } catch (e) {
      console.warn('Notification failed, falling back to alert.', e);
      alert(message);
    }
  }
}