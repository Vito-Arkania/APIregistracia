import { Component, inject, OnInit } from '@angular/core';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  private readonly auth = inject(Auth);
  
  user: any = null;
  activeTab: 'info' | 'orders' = 'info';

  ngOnInit() {
  const data = localStorage.getItem('user_data');
  if (data) {
    this.user = JSON.parse(data);
  }
}

  setTab(tab: 'info' | 'orders') {
    this.activeTab = tab;
  }

  userStatus = 'Gold Baker'; // Статус пользователя
  loyaltyPoints = 1250;      // Баллы за покупки
  recentOrders = [
    { id: '#BK-9921', date: '05.06.2026', items: 'Blueberry Muffin, Croissant', total: 24.50, status: 'Delivered' },
    { id: '#BK-8842', date: '28.05.2026', items: 'Sourdough Bread', total: 12.00, status: 'Processing' }
  ];
}