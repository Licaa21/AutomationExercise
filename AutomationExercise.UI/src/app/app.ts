import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from './services/auth';
import { Cart as CartService } from './services/cart';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { ProductList } from './components/product-list/product-list';
import { Cart } from './components/cart/cart';
import { Checkout } from './components/checkout/checkout';

@Component({
  selector: 'app-root',
  imports: [CommonModule, Login, Register, ProductList, Cart, Checkout],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  showLogin: boolean = false;
  showRegister: boolean = false
  showCart: boolean = false;
  showCheckout: boolean = false;
  cartItemCount: number = 0;

  constructor(public auth: Auth, private cartService: CartService) {}
  ngOnInit() {
    this.cartService.cart$.subscribe(cartItems => {
      this.cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    });
  }
  onLoginSuccess() {
    this.showLogin = false;
    this.cartService.loadCart(this.auth.getUserId());
  }
  onGotoRegister() {
    this.showLogin = false;
    this.showRegister = true;
  }
  onGotoLogin() {
    this.showRegister = false;
    this.showLogin = true;
  }
  onRequestLogin() {
    this.showLogin = true;
  }
  logout() {
    this.cartService.saveCart(this.auth.getUserId());
    this.auth.logout();
    this.cartService.clearCart();
    this.showCart = false;
    this.showCheckout = false;
  }
  toggleCart() {
    this.showCart = !this.showCart;
    this.showCheckout = false;
  }
  onProceedToCheckout() {
    this.showCart = false;
    this.showCheckout = true;
  }
  onOrderPlaced() {
    this.showCheckout = false;
  }
}
