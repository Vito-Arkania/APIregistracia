import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CookieItem } from '../../models';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
})
export class Cart {
  cart: Array<CookieItem & { qty?: number }> = [];
  total = 0;

  private readonly cartService = inject(CartService);
  private readonly notification = inject(NotificationService);

  constructor() {
    this.cartService.items$.subscribe(items => {
      this.cart = items || [];
      this.calculateTotal();
    });
  }

  calculateTotal() {
    this.total = this.cart.reduce((s, item) => s + ((item?.price || 0) * (item.qty || 1)), 0);
  }

  removeItem(i: number) {
    const it = this.cart[i];
    this.cartService.remove(i);
    if (it) this.notification.show(`Removed "${it.name}" from cart.`);
  }

  changeQty(i: number, delta: number) {
    const it = this.cart[i];
    this.cartService.changeQty(i, delta);
    if (it) this.notification.show(`Updated quantity for "${it.name}".`);
  }

  clearCart() {
    this.cartService.clear();
    this.notification.show('Cart cleared.');
  }
}
