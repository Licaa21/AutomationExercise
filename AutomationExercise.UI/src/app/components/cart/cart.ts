import { Component,OnInit,OnDestroy,Output,EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cart as CartService,CartItem } from '../../services/cart';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})

export class Cart implements OnInit,OnDestroy {
  cartItems: CartItem[] = [];
  total: number = 0;
  @Output() proceedToCheckout = new EventEmitter<void>();
  @Output() closeCart = new EventEmitter<void>();

  private subscription: Subscription = new Subscription();

  constructor(private cartService: CartService) {}
  ngOnInit() {
    this.subscription.add(
      this.cartService.cart$.subscribe((items: CartItem[]) => {
        this.cartItems = items;
        this.total = parseFloat(items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2));
      })
    );
  }
  ngOnDestroy() {    this.subscription.unsubscribe();
  }
  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }
  increment(productId: number) {
    this.cartService.updateQuantity(productId, 1);
  }
  decrement(productId: number) {
    this.cartService.updateQuantity(productId, -1);
  }
}
