import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Auth } from './auth';

function makeToken(exp: number): string {
  const header = btoa('{"alg":"HS256","typ":"JWT"}');
  const payload = btoa(JSON.stringify({ exp }));
  return `${header}.${payload}.signature`;
}

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

  it('should save and load profile from localStorage', () => {
    const profile = { username: 'Robert1', email: 'robert@test.com', createdAt: '2026-01-01' };
    service.saveProfile(profile);
    expect(service.loadProfile()).toEqual(profile);
  });

  it('should return null when no profile is stored', () => {
    expect(service.loadProfile()).toBeNull();
  });

  it('should remove profile from localStorage on logout', () => {
    service.saveProfile({ username: 'Robert1', email: 'r@r.com', createdAt: '2026-01-01' });
    service.logout();
    expect(service.loadProfile()).toBeNull();
  });

  it('should return true for isTokenExpired when no token is stored', () => {
    expect(service.isTokenExpired()).toBe(true);
  });

  it('should return true for isTokenExpired when token is expired', () => {
    const expiredExp = Math.floor(Date.now() / 1000) - 3600;
    service.saveToken(makeToken(expiredExp));
    expect(service.isTokenExpired()).toBe(true);
  });

  it('should return false for isTokenExpired when token is still valid', () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600;
    service.saveToken(makeToken(futureExp));
    expect(service.isTokenExpired()).toBe(false);
  });
});
