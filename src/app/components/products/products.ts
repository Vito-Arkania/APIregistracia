import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router'; // Добавили Router и ActivatedRoute
import { Auth } from '../../services/auth';
import { CookieItem } from '../../models';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Products implements OnInit {
  private readonly auth = inject(Auth);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly cartService = inject(CartService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);         // Добавили
  private readonly route = inject(ActivatedRoute);  // Добавили

  cookies: CookieItem[] = [];
  search = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  onlyDiscount = false;

  ngOnInit(): void {
    // Читаем параметры из URL при загрузке страницы
    this.route.queryParams.subscribe(params => {
      this.search = params['search'] || '';
      this.minPrice = params['minPrice'] ? Number(params['minPrice']) : null;
      this.maxPrice = params['maxPrice'] ? Number(params['maxPrice']) : null;
      this.onlyDiscount = params['onlyDiscount'] === 'true';
    });

    this.loadData();
  }

  // Метод, который мы вызываем при любом изменении фильтра
  updateFilters(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: this.search || null,
        minPrice: this.minPrice || null,
        maxPrice: this.maxPrice || null,
        onlyDiscount: this.onlyDiscount ? 'true' : null
      },
      queryParamsHandling: 'merge'
    });
  }

  loadData(): void {
    this.auth.getCookies().subscribe({
      next: (data: CookieItem[]) => {
        this.cookies = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load products', err),
    });
  }

  get filteredCookies(): CookieItem[] {
    let items = [...this.cookies];
    if (this.search && this.search.trim()) {
      const q = this.search.toLowerCase();
      items = items.filter(i => i.name.toLowerCase().includes(q));
    }
    if (this.minPrice != null) items = items.filter(i => i.price >= this.minPrice!);
    if (this.maxPrice != null) items = items.filter(i => i.price <= this.maxPrice!);
    if (this.onlyDiscount) items = items.filter(i => !!i['old-price'] && i['old-price'].toString().trim() !== '');
    return items;
  }

  addToCart(item: CookieItem): void {
    if (!item) return;
    this.cartService.add({ ...item, qty: 1 });
    this.notification.show(`Added "${item.name}" to cart.`, 'success');
  }

  clearFilters(): void {
    this.search = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.onlyDiscount = false;
    
    // Сбрасываем URL
    this.router.navigate([], { queryParams: {} });
  }
}