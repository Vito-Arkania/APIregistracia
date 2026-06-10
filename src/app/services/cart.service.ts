import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CookieItem } from '../models';

type CartItem = CookieItem & { qty?: number };

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>(this.loadFromStorage());
  items$ = this.itemsSubject.asObservable();

  // count as total quantity in cart
  count$ = new BehaviorSubject<number>(this.totalCount(this.itemsSubject.getValue()));

  private loadFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem('cart');
      if (raw) {
        const parsed = JSON.parse(raw) as any[];
        if (Array.isArray(parsed)) {
          return parsed.map(p => ({ ...p, qty: p.qty && p.qty > 0 ? p.qty : 1 }));
        }
      }
    } catch {
      // ignore
    }
    return [];
  }

  private totalCount(items: CartItem[]) {
    return items.reduce((s, it) => s + ((it.qty && it.qty > 0) ? it.qty : 1), 0);
  }

  private save(items: CartItem[]) {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch {}
    this.itemsSubject.next(items);
    this.count$.next(this.totalCount(items));
  }

  add(item: CartItem) {
    const items = this.itemsSubject.getValue().slice();
    const idx = items.findIndex(i => i.id === item.id);
    if (idx >= 0) {
      items[idx].qty = (items[idx].qty || 1) + (item.qty || 1);
    } else {
      items.push({ ...item, qty: item.qty || 1 });
    }
    this.save(items);
  }

  changeQty(index: number, delta: number) {
    const items = this.itemsSubject.getValue().slice();
    const it = items[index];
    if (!it) return;
    it.qty = Math.max(0, (it.qty || 1) + delta);
    if (it.qty === 0) items.splice(index, 1);
    this.save(items);
  }

  remove(index: number) {
    const items = this.itemsSubject.getValue().slice();
    if (index >= 0 && index < items.length) {
      items.splice(index, 1);
      this.save(items);
    }
  }

  clear() {
    this.save([]);
  }

  getItems(): CartItem[] {
    return this.itemsSubject.getValue();
  }
}
