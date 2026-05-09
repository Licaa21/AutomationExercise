import { Component,OnInit } from '@angular/core';
import { Output,EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product';
import { Cart, CartItem } from '../../services/cart';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit{
  products: Product[] = [];
  @Output() requestLogin = new EventEmitter<void>();
  constructor(private productService: ProductService, private cart: Cart, private auth: Auth) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      },
    });
  }

  addToCart(product: Product): void {
    if (!this.auth.isLoggedIn()) {
      this.requestLogin.emit();
      return;
    }
    const cartItem: CartItem = {
      productId: product.productID,
      name: product.name,
      price: product.price,
      quantity: 1,
    };
    this.cart.addToCart(cartItem);
  }
}
