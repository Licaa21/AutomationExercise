import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Product {
  productID: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  imagePosition: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private _products$ = new BehaviorSubject<Product[]>([]);
  products$ = this._products$.asObservable();

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('http://localhost:5279/api/products').pipe(
      tap(products => this._products$.next(products))
    );
  }
}
