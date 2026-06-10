import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { LoginUser, CookieItem } from '../models';

@Injectable({ providedIn: 'root' })
export class Auth {
  readonly API_URL = 'https://api.everrest.educata.dev/auth/sign_in';
  readonly SIGN_UP_URL = 'https://api.everrest.educata.dev/auth/sign_up';
  readonly COOKIES_URL = 'https://69e77ac468208c1debe8f2cf.mockapi.io/Cookies';
  readonly CART_URL = 'https://69e77ac468208c1debe8f2cf.mockapi.io/Cart';

  http = inject(HttpClient);

  // Реактивные переменные
  private authStatus = new BehaviorSubject<boolean>(!!localStorage.getItem('acc_token'));
  authStatus$ = this.authStatus.asObservable();

  // Методы API
  signIn(user: LoginUser): Observable<any> { return this.http.post<any>(this.API_URL, user); }
  signUp(user: any): Observable<any> { return this.http.post<any>(this.SIGN_UP_URL, user); }
  getCookies(): Observable<CookieItem[]> { return this.http.get<CookieItem[]>(this.COOKIES_URL); }
  getUser() { return this.http.get('https://api.everrest.educata.dev/auth/user'); }

  // Работа с токеном
  saveToken(token: string, userData?: any) {
    localStorage.setItem('acc_token', token);
    if (userData) localStorage.setItem('user_data', JSON.stringify(userData));
    this.authStatus.next(true); // Уведомляем хедер
  }

  logOut() {
    localStorage.removeItem('acc_token');
    localStorage.removeItem('user_data');
    this.authStatus.next(false); // Уведомляем хедер
  }
}