import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Auth } from './auth';

describe('Auth Service', () => {
  let service: Auth;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(Auth);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return false for isLoggedIn when no token is stored', () => {
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should return true for isLoggedIn after saving a token', () => {
    service.saveToken('my-jwt-token');
    expect(service.isLoggedIn()).toBe(true);
  });

  it('should save and retrieve a token', () => {
    service.saveToken('my-jwt-token');
    expect(service.getToken()).toBe('my-jwt-token');
  });

  it('should return null for getToken when no token is stored', () => {
    expect(service.getToken()).toBeNull();
  });

  it('should remove token from storage on logout', () => {
    service.saveToken('my-jwt-token');
    service.logout();
    expect(service.getToken()).toBeNull();
  });

  it('should set isLoggedIn to false after logout', () => {
    service.saveToken('my-jwt-token');
    service.logout();
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should save and retrieve userId', () => {
    service.saveUserId(42);
    expect(service.getUserId()).toBe(42);
  });

  it('should return 0 for getUserId when nothing is stored', () => {
    expect(service.getUserId()).toBe(0);
  });

  it('should remove userId on logout', () => {
    service.saveUserId(42);
    service.logout();
    expect(service.getUserId()).toBe(0);
  });
});
