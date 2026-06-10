import { Component, inject, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
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
export class Home implements OnInit, AfterViewInit, OnDestroy {
  // Внедрение сервисов через inject
  private readonly auth = inject(Auth);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly cartService = inject(CartService);
  private readonly notification = inject(NotificationService);
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  
  cookies: CookieItem[] = [];
  private observer!: IntersectionObserver;

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.initObserver();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  scroll(direction: 'left' | 'right') {
  if (this.scrollContainer) {
    const container = this.scrollContainer.nativeElement;
    
    // Берем ширину первой карточки + gap (отступ)
    const card = container.querySelector('.product-card') as HTMLElement;
    const cardWidth = card ? card.offsetWidth + 20 : 300; // 20 - это твой gap

    container.scrollBy({
      left: direction === 'left' ? -cardWidth : cardWidth,
      behavior: 'smooth'
    });
  }
}

  loadData() {
    this.auth.getCookies().subscribe({
      next: (data: CookieItem[]) => {
        this.cookies = data;
        this.cdr.detectChanges();
        
        // Запускаем анимацию после того, как данные отрисовались в DOM
        setTimeout(() => this.initObserver(), 0);
      },
      error: (err) => {
        console.error('Ошибка при загрузке данных из API:', err);
      }
    });
  }

  private initObserver(): void {
    const options = { threshold: 0.2 };

    this.observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.renderer.addClass(entry.target, 'animate-show');
          obs.unobserve(entry.target);
        }
      });
    }, options);

    const elements = this.el.nativeElement.querySelectorAll('.animate-on-scroll');
    elements.forEach((el: HTMLElement) => {
      this.renderer.addClass(el, 'animate-hidden');
      this.observer.observe(el);
    });
  }

  addToCart(item: CookieItem) {
    if (!item) return;
    this.cartService.add({ ...item, qty: 1 });
    this.notification.show(`Added "${item.name}" to cart.`);
  }
}