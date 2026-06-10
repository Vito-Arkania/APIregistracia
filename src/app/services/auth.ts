import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginUser } from '../models';
import { Token } from '@angular/compiler';
import { CookieItem } from '../models';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  // Твой существующий URL для логина
  readonly API_URL = 'https://api.everrest.educata.dev/auth/sign_in';

  // Новый URL для регистрации по твоей ссылке
  readonly SIGN_UP_URL = 'https://api.everrest.educata.dev/auth/sign_up';
   

  readonly COOKIES_URL = 'https://69e77ac468208c1debe8f2cf.mockapi.io/Cookies';

  readonly CART_URL:string = 'https://69e77ac468208c1debe8f2cf.mockapi.io/Cart';
  

  http = inject(HttpClient);
  
  // Твой метод для логина
  signIn(user: LoginUser): Observable<Token> {
    return this.http.post<Token>(this.API_URL, user);
  }

  // Новый метод для регистрации
  signUp(user: any): Observable<any> {
    return this.http.post<any>(this.SIGN_UP_URL, user);
  }

  // Твой метод сохранения токена
  saveToken(token: string) {
    localStorage.setItem('acc_token', token);
  }

  // Твой метод получения токена
  getToken(): string | null {
    return localStorage.getItem('acc_token');
  }

  // Твой метод проверки авторизации
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCookies(): Observable<CookieItem[]> {
  return this.http.get<CookieItem[]>(this.COOKIES_URL);
}

  logOut() {
  localStorage.removeItem('acc_token');
}

getUser() {
  return this.http.get('https://api.everrest.educata.dev/auth/user');
}

//--------USER PROFILE INFO MORE---------//
}
