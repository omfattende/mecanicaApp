import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RegisterComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  successMessage = '';
  showRegisterModal = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onLogin() {
    this.errorMessage = '';
    this.successMessage = '';
    
    const success = await this.authService.login(this.username, this.password);
    
    if (success) {
      const currentUser = this.authService.getCurrentUser();
      
      // Redirigir según el tipo de usuario
      if (currentUser?.tipo === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/cliente']);
      }
    } else {
      this.errorMessage = 'Usuario o contraseña incorrectos';
    }
  }

  openRegisterModal() {
    this.showRegisterModal = true;
  }

  closeRegisterModal() {
    this.showRegisterModal = false;
  }

  onRegistrationSuccess(message: string) {
    this.successMessage = message;
    this.errorMessage = '';
    // Limpiar el formulario de login
    this.username = '';
    this.password = '';
  }
}
