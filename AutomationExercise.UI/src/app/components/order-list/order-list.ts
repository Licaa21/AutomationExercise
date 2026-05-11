import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Auth } from '../../services/auth';
interface OrderItem {
    productID: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    imageUrl: string;
}
interface Order {
    orderID: number;
    orderNumber: number;
    orderDate: string;
    totalPrice: number;
    shippingAddress: string;
    orderItems: OrderItem[];
}

@Component({
  selector: 'app-order-list',
  imports: [CommonModule], 
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss'
})




export class OrderList implements OnInit {
    @Output() close = new EventEmitter<void>();
    constructor(private http: HttpClient, private auth: Auth) {}
    orders: Order[] = [];
    loading= true;
    error = '';
    ngOnInit(): void {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.auth.getToken()}`
        });
        this.http.get<Order[]>(`http://localhost:5279/api/orders/user/${this.auth.getUserId()}`, { headers }).subscribe({
            next: (data) => {
                this.orders = data;
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Failed to load orders.';
                this.loading = false;
            }
        });
    }
}