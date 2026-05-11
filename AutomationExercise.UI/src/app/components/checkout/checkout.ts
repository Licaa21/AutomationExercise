import { Component, Output, EventEmitter, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Cart as CartService, CartItem } from '../../services/cart';
import { Auth } from '../../services/auth';
import { ProductService, Product } from '../../services/product';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [FormsModule, CommonModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout implements OnInit {
  shippingAddress: string = '';
  mentions: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  cartItems: CartItem[] = []
  priceChanges: { name: string; oldPrice: number; newPrice: number }[] = [];
  pendingCartItems: CartItem[] = [];
  showPriceConfirm = false;

  @Output() orderPlaced = new EventEmitter<void>();
  @Output() closeCheckout = new EventEmitter<void>();

  constructor(
    private cartService: CartService,
    private http: HttpClient,
    private auth: Auth,
    private cdr: ChangeDetectorRef,
    private productService: ProductService
  ) {}
  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.cdr.detectChanges();
    });
  }
  get totalPrice(): number {
    return parseFloat(this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2));
  }
  placeOrder() {
    this.cartService.cart$.pipe(take(1)).subscribe((cartItems: CartItem[]) => {
      this.productService.getProducts().pipe(take(1)).subscribe((freshProducts: Product[]) => {
        const changes: { name: string; oldPrice: number; newPrice: number }[] = [];
        const updatedItems = cartItems.map(item => {
          const fresh = freshProducts.find(p => p.productID === item.productId);
          if (fresh && fresh.price !== item.price) {
            changes.push({ name: item.name, oldPrice: item.price, newPrice: fresh.price });
            return { ...item, price: fresh.price };
          }
          return item;
        });

        if (changes.length > 0) {
          this.priceChanges = changes;
          this.pendingCartItems = updatedItems;
          this.showPriceConfirm = true;
          this.cdr.detectChanges();
        } else {
          this.submitOrder(cartItems);
        }
      });
    });
  }

  confirmOrder() {
    this.showPriceConfirm = false;
    this.submitOrder(this.pendingCartItems);
  }

  cancelPriceConfirm() {
    this.showPriceConfirm = false;
    this.priceChanges = [];
    this.pendingCartItems = [];
  }

  private submitOrder(cartItems: CartItem[]) {
    const order = {
      orderNumber: Math.floor(Math.random() * 1000000),
      shippingAddress: this.shippingAddress,
      mentions: this.mentions,
      orderDate: new Date().toISOString(),
      totalPrice: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      userID: this.auth.getUserId(),
      orderItems: cartItems.map(item => ({
        productID: item.productId,
        quantity: item.quantity,
        unitPrice: item.price
      }))
    };

    this.http.post('http://localhost:5279/api/orders', order).subscribe({
      next: () => {
        this.successMessage = 'Order placed successfully!';
        this.cdr.detectChanges();
        this.cartService.clearCart();
        setTimeout(() => {
          this.orderPlaced.emit();
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = 'Failed to place order.';
        this.cdr.detectChanges();
        console.error('Error placing order:', error);
      }
    });
  }
}
