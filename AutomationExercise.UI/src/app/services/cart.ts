import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class Cart {
  private cartSubject: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>([]);
  public cart$: Observable<CartItem[]> = this.cartSubject.asObservable();

  addToCart(item: CartItem): void 
  {
    const currentCart = this.cartSubject.getValue();
    const existingItemIndex = currentCart.findIndex(
      (cartItem) => cartItem.productId === item.productId
    );

    if (existingItemIndex !== -1) 
    {
      currentCart[existingItemIndex].quantity += item.quantity;
    } 
    else 
    {
      currentCart.push(item);
    }

    this.cartSubject.next(currentCart);
  }
  removeFromCart(productId: number): void 
  {
    const currentCart = this.cartSubject.getValue();
    const updatedCart = currentCart.filter(
      (cartItem) => cartItem.productId !== productId
    );
    this.cartSubject.next(updatedCart);
  }

  clearCart(): void
  {
    this.cartSubject.next([]);
  }

  saveCart(userId: number): void {
    localStorage.setItem(`cart_${userId}`, JSON.stringify(this.cartSubject.getValue()));
  }

  loadCart(userId: number): void {
    const saved = localStorage.getItem(`cart_${userId}`);
    if (saved) {
      this.cartSubject.next(JSON.parse(saved));
    }
  }
}
