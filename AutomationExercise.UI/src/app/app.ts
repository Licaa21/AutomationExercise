import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from './services/auth';
import { Cart as CartService } from './services/cart';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { ProductList } from './components/product-list/product-list';
import { Cart } from './components/cart/cart';
import { Checkout } from './components/checkout/checkout';
import { OrderList} from './components/order-list/order-list';

@Component({
  selector: 'app-root',
  imports: [CommonModule, Login, Register, ProductList, Cart, Checkout, OrderList],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  showLogin: boolean = false;
  showRegister: boolean = false
  showCart: boolean = false;
  showCheckout: boolean = false;
  showProfile = false;
  showOrders = false;
  profileUser: { username: string, email: string; createdAt: string } | null = null;
  cartItemCount: number = 0;

  constructor(public auth: Auth, private cartService: CartService) {}
  ngOnInit() {
    this.cartService.cart$.subscribe(cartItems => {
      this.cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    });
    if (this.auth.isLoggedIn() && this.auth.isTokenExpired()) {
      this.logout();
    } else if (this.auth.isLoggedIn()) {
      this.profileUser = this.auth.loadProfile();
    }
  }
  onLoginSuccess() {
    this.showLogin = false;
    this.cartService.loadCart(this.auth.getUserId());
    this.auth.getprofile().subscribe(profile => {
      this.auth.saveProfile(profile);
      this.profileUser = profile;
    })
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
    this.profileUser = null;
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
