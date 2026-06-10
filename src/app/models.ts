export interface LoginUser {
    email:string
    password:string
}

export interface Token {
    access_token:string
    refresh_token:string
}

export interface CookieItem {
  id: string;
  name: string;
  price: number;
  'old-price': string; // Именно так, с кавычками и дефисом
  img: string;      
}
