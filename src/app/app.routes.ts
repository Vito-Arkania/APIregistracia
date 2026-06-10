import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Home } from './components/home/home';
import { About } from './components/about/about';
import { Products } from './components/products/products';
import { Cart } from './components/cart/cart';
import { Profile } from './components/profile/profile';
import { Blogs } from './components/blogs/blogs';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' }, 
  { path: 'home', component: Home },
    {
        path: 'about',
        component: About
    },
    {
        path: 'products',
        component: Products
    },
    {
        path:'login',
        component:Login
    },
    {
        path:'register',
        component:Register
    },
    {
        path: 'cart',
        component: Cart
    },
    {
        path: 'profile',
        component: Profile
    },
    {
        path: 'blogs',
        component: Blogs
    },
    {
        path:'**',
        component:Error
    },
];
