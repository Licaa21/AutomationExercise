import { TestBed } from '@angular/core/testing';
import { Cart, CartItem } from './cart';

describe('Cart Service', () => {
  let service: Cart;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Cart);
    service.clearCart();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a new item to the cart', () => {
    const item: CartItem = { productId: 1, name: 'Wireless Mouse', price: 25.99, quantity: 1 };
    service.addToCart(item);
    service.cart$.subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].name).toBe('Wireless Mouse');
    });
  });

  it('should increment quantity when adding an already existing item', () => {
    const item: CartItem = { productId: 1, name: 'Wireless Mouse', price: 25.99, quantity: 1 };
    service.addToCart(item);
    service.addToCart(item);
    service.cart$.subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].quantity).toBe(2);
    });
  });

  it('should keep separate entries for different products', () => {
    service.addToCart({ productId: 1, name: 'Mouse', price: 25.99, quantity: 1 });
    service.addToCart({ productId: 2, name: 'Keyboard', price: 89.99, quantity: 1 });
    service.cart$.subscribe(items => {
      expect(items.length).toBe(2);
    });
  });

  it('should remove an item from the cart by productId', () => {
    service.addToCart({ productId: 1, name: 'Wireless Mouse', price: 25.99, quantity: 1 });
    service.removeFromCart(1);
    service.cart$.subscribe(items => {
      expect(items.length).toBe(0);
    });
  });

  it('should not affect cart when removing a productId that does not exist', () => {
    service.addToCart({ productId: 1, name: 'Wireless Mouse', price: 25.99, quantity: 1 });
    service.removeFromCart(999);
    service.cart$.subscribe(items => {
      expect(items.length).toBe(1);
    });
  });

  it('should clear all items from the cart', () => {
    service.addToCart({ productId: 1, name: 'Mouse', price: 25.99, quantity: 1 });
    service.addToCart({ productId: 2, name: 'Keyboard', price: 89.99, quantity: 1 });
    service.clearCart();
    service.cart$.subscribe(items => {
      expect(items.length).toBe(0);
    });
  });

  it('should calculate total price correctly', () => {
    service.addToCart({ productId: 1, name: 'Mouse', price: 25.00, quantity: 2 });
    service.addToCart({ productId: 2, name: 'Keyboard', price: 90.00, quantity: 1 });
    service.cart$.subscribe(items => {
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      expect(total).toBe(140.00);
    });
  });

  it('should emit updated cart after each operation', () => {
    const emissions: number[] = [];
    service.cart$.subscribe(items => emissions.push(items.length));

    service.addToCart({ productId: 1, name: 'Mouse', price: 25.99, quantity: 1 });
    service.addToCart({ productId: 2, name: 'Keyboard', price: 89.99, quantity: 1 });
    service.removeFromCart(1);

    expect(emissions).toEqual([0, 1, 2, 1]);
  });
});
