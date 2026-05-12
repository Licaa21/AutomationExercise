import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Register } from './register';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set errorMessage for invalid email format', () => {
    component.username = 'testuser';
    component.email = 'not-an-email';
    component.password = 'password123';
    component.register();
    expect(component.errorMessage).toBe('Please enter a valid email address.');
  });

  it('should not set email error for valid email format', () => {
    component.username = 'testuser';
    component.email = 'valid@email.com';
    component.password = 'password123';
    component.register();
    expect(component.errorMessage).not.toBe('Please enter a valid email address.');
  });

  it('should set errorMessage for email missing @ symbol', () => {
    component.email = 'invalidemail.com';
    component.register();
    expect(component.errorMessage).toBe('Please enter a valid email address.');
  });

  it('should set errorMessage for email missing domain', () => {
    component.email = 'user@';
    component.register();
    expect(component.errorMessage).toBe('Please enter a valid email address.');
  });
});
