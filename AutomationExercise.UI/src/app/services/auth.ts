import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:5279/api/auth';

  constructor(private http: HttpClient) {}

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, email, password });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }
  
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userProfile');
  }
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
  saveUserId(id: number): void {
    localStorage.setItem('userId', id.toString());
  }
  getUserId() {
    return parseInt(localStorage.getItem('userId') ?? '0');
    
  }
  getprofile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile?userId=${this.getUserId()}`);
  }
  saveProfile(profile: any){
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }
  loadProfile():any
  {
    const raw = localStorage.getItem('userProfile');
    return raw ? JSON.parse(raw) : null;
  }
}
