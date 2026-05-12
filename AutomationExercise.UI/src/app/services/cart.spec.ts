import { TestBed } from '@angular/core/testing';
import { Cart, CartItem } from './cart';

const mockItem = (id: number, name: string, price: number, qty: number): CartItem => ({
  productId: id, name, price, quantity: qty, imageUrl: 'img.jpg'
});

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
    service.addToCart(mockItem(1, 'Wireless Mouse', 25.99, 1));
    service.cart$.subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].name).toBe('Wireless Mouse');
    });
  });

  it('should increment quantity when adding an already existing item', () => {
    service.addToCart(mockItem(1, 'Wireless Mouse', 25.99, 1));
    service.addToCart(mockItem(1, 'Wireless Mouse', 25.99, 1));
    service.cart$.subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].quantity).toBe(2);
    });
  });

  it('should keep separate entries for different products', () => {
    service.addToCart(mockItem(1, 'Mouse', 25.99, 1));
    service.addToCart(mockItem(2, 'Keyboard', 89.99, 1));
    service.cart$.subscribe(items => {
      expect(items.length).toBe(2);
    });
  });

  it('should remove an item from the cart by productId', () => {
    service.addToCart(mockItem(1, 'Wireless Mouse', 25.99, 1));
    service.removeFromCart(1);
    service.cart$.subscribe(items => {
      expect(items.length).toBe(0);
    });
  });

  it('should not affect cart when removing a productId that does not exist', () => {
    service.addToCart(mockItem(1, 'Wireless Mouse', 25.99, 1));
    service.removeFromCart(999);
    service.cart$.subscribe(items => {
      expect(items.length).toBe(1);
    });
  });

  it('should clear all items from the cart', () => {
    service.addToCart(mockItem(1, 'Mouse', 25.99, 1));
    service.addToCart(mockItem(2, 'Keyboard', 89.99, 1));
    service.clearCart();
    service.cart$.subscribe(items => {
      expect(items.length).toBe(0);
    });
  });

  it('should calculate total price correctly', () => {
    service.addToCart(mockItem(1, 'Mouse', 25.00, 2));
    service.addToCart(mockItem(2, 'Keyboard', 90.00, 1));
    service.cart$.subscribe(items => {
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      expect(total).toBe(140.00);
    });
  });

  it('should emit updated cart after each operation', () => {
    const emissions: number[] = [];
    service.cart$.subscribe(items => emissions.push(items.length));

    service.addToCart(mockItem(1, 'Mouse', 25.99, 1));
    service.addToCart(mockItem(2, 'Keyboard', 89.99, 1));
    service.removeFromCart(1);

    expect(emissions).toEqual([0, 1, 2, 1]);
  });

  it('should increment item quantity with updateQuantity', () => {
    service.addToCart(mockItem(1, 'Mouse', 25.99, 1));
    service.updateQuantity(1, 1);
    service.cart$.subscribe(items => {
      expect(items[0].quantity).toBe(2);
    });
  });

  it('should decrement item quantity with updateQuantity', () => {
    service.addToCart(mockItem(1, 'Mouse', 25.99, 3));
    service.updateQuantity(1, -1);
    service.cart$.subscribe(items => {
      expect(items[0].quantity).toBe(2);
    });
  });

  it('should remove item when updateQuantity decrements to 0', () => {
    service.addToCart(mockItem(1, 'Mouse', 25.99, 1));
    service.updateQuantity(1, -1);
    service.cart$.subscribe(items => {
      expect(items.length).toBe(0);
    });
  });

  it('should do nothing when updateQuantity is called with unknown productId', () => {
    service.addToCart(mockItem(1, 'Mouse', 25.99, 2));
    service.updateQuantity(999, -1);
    service.cart$.subscribe(items => {
      expect(items[0].quantity).toBe(2);
    });
  });
});
