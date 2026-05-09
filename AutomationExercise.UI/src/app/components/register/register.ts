import { Component } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  username: string = '';
  email: string = ''
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  @Output() goToLogin = new EventEmitter<void>();

  constructor(private auth: Auth) {}

  register(): void {
    this.auth.register(this.username, this.email, this.password).subscribe({
      next: (response) => {
        this.successMessage = 'Registration successful! You can now log in.';
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = 'Registration failed. Please try again.';
        this.successMessage = '';
      },
    });
  }
}
