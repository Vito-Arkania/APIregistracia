import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Auth } from '../../services/auth';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header implements OnInit {
  readonly auth = inject(Auth);
  readonly cartService = inject(CartService);

  isMenuOpen = false;
  cartCount = 0;
  isLoggedIn = false;
  user: any = null; // Данные пользователя уже здесь!

  ngOnInit() {
    this.auth.authStatus$.subscribe(status => {
      this.isLoggedIn = status;
      if (status) {
        const userData = localStorage.getItem('user_data');
        this.user = userData ? JSON.parse(userData) : null;
      } else {
        this.user = null;
      }
    });

    this.cartService.count$.subscribe((c) => this.cartCount = c);
  }

  // Используем уже загруженный this.user, это быстрее и правильнее
  get userName(): string {
    if (!this.user) return 'User';
    
    // Если есть firstName и lastName
    if (this.user.firstName && this.user.lastName) {
      return `${this.user.firstName} ${this.user.lastName}`;
    }
    
    // Fallback на name или email
    return this.user.name || this.user.email || 'User';
  }

  logout() { this.auth.logOut(); }
  toggleMenu() { this.isMenuOpen = !this.isMenuOpen; }
}