import { Component, inject } from '@angular/core';
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common"; // Добавь этот импорт
import { Auth } from '../../services/auth';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true, // Убедись, что это стоит
  imports: [RouterModule, CommonModule], // Добавь CommonModule сюда
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  readonly auth = inject(Auth);

  readonly cartService = inject(CartService);

  isMenuOpen = false;

  cartCount = 0;

  user: any = null

  constructor() {
    if (this.auth.isLoggedIn()) {
      this.auth.getUser().subscribe({
        next: (data) => this.user = data,
        error: () => this.user = null
      });
    }

    // subscribe to cart count updates
    this.cartService.count$.subscribe((c) => this.cartCount = c);
  }

  // 3. Добавьте метод logout
  logout() {
    this.auth.logOut();
    this.user = null;
    window.location.reload(); // Перезагружаем для сброса состояния
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}