import { Component, inject, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';
import { CookieItem } from '../../models';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  // Внедрение сервисов
  private readonly auth = inject(Auth);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  
  // Инициализируем пустым массивом, чтобы избежать ошибок при рендеринге
  cookies: CookieItem[] = [];

  ngOnInit() {
    this.loadData();
  }

  private readonly cartService = inject(CartService);
  private readonly notification = inject(NotificationService);

  scroll(direction: 'left' | 'right') {
    if (this.scrollContainer) {
      const container = this.scrollContainer.nativeElement;
      const scrollAmount = 500; // Расстояние прокрутки
      
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  loadData() {
    this.auth.getCookies().subscribe({
      next: (data: CookieItem[]) => {
        // Присваиваем данные
        this.cookies = data;
        console.log('Данные успешно получены:', this.cookies);
        
        // Принудительно вызываем обновление Angular, 
        // чтобы интерфейс отрисовался сразу после получения данных
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Ошибка при загрузке данных из API:', err);
      }
    });
  }

  addToCart(item: CookieItem) {
    if (!item) return;
    // Use CartService to add item and show a user-facing English message
    this.cartService.add({ ...item, qty: 1 });
    this.notification.show(`Added "${item.name}" to cart.`);
  }
}