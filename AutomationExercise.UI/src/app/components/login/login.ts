import { Component} from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';


@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  @Output() loginSuccess = new EventEmitter<void>();
  @Output() goToRegister = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  constructor(private auth: Auth) {}
  login(): void {
    this.auth.login(this.username, this.password).subscribe({
      next: (response) => {
        this.auth.saveToken(response.token);
        this.auth.saveUserId(response.userID);
        this.loginSuccess.emit();
      },
      error: (err) => {
        this.errorMessage = 'Login failed. Please check your credentials.';
      },
    });
  }
};
