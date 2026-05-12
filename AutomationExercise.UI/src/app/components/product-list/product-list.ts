import { Component,OnInit } from '@angular/core';
import { Output,EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product';
import { Cart, CartItem } from '../../services/cart';
import { Auth } from '../../services/auth';
import { Observable, retry } from 'rxjs';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  products$!: Observable<Product[]>;
  selectedProduct: Product | null = null;
  @Output() requestLogin = new EventEmitter<void>();
  @Output() itemAdded = new EventEmitter<void>();
  constructor(private productService: ProductService, private cart: Cart, private auth: Auth) {}
  ngOnInit(): void {
    this.products$ = this.productService.products$;
    this.productService.getProducts().pipe(retry({ count: 3, delay: 3000 })).subscribe();
  }
  openProduct(product: Product): void {
    this.selectedProduct = product;
    document.body.classList.add('no-scroll');
  }
  closeProduct(): void {
    this.selectedProduct = null;
    document.body.classList.remove('no-scroll');
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
      imageUrl: product.imageUrl,
    };
    this.cart.addToCart(cartItem);
    this.itemAdded.emit();
  }
}
