import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Checkout } from './checkout';
import { Cart, CartItem } from '../../services/cart';

const mockItem = (id: number, price: number, qty: number): CartItem => ({
  productId: id, name: 'Product ' + id, price, quantity: qty, imageUrl: 'img.jpg'
});

describe('Checkout', () => {
  let component: Checkout;
  let fixture: ComponentFixture<Checkout>;
  let cartService: Cart;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Checkout],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(Checkout);
    component = fixture.componentInstance;
    cartService = TestBed.inject(Cart);
    cartService.clearCart();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return 0 for totalPrice when cart is empty', () => {
    expect(component.totalPrice).toBe(0);
  });

  it('should calculate totalPrice correctly from cart items', () => {
    cartService.addToCart(mockItem(1, 25.00, 2));
    cartService.addToCart(mockItem(2, 90.00, 1));
    fixture.detectChanges();
    expect(component.totalPrice).toBe(140.00);
  });

  it('should round totalPrice to 2 decimal places', () => {
    cartService.addToCart(mockItem(1, 0.1, 3));
    fixture.detectChanges();
    expect(component.totalPrice).toBe(0.30);
  });

  it('should update totalPrice when cart changes', () => {
    cartService.addToCart(mockItem(1, 50.00, 1));
    fixture.detectChanges();
    expect(component.totalPrice).toBe(50.00);

    cartService.addToCart(mockItem(2, 25.00, 1));
    fixture.detectChanges();
    expect(component.totalPrice).toBe(75.00);
  });
});
