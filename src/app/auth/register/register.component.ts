import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() registrationSuccess = new EventEmitter<string>();

  formData = {
    username: '',
    email: '',
    nombre: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  };
  
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService) {}

  async onSubmit() {
    if (!this.isFormValid()) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    if (this.formData.password !== this.formData.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    if (this.formData.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    if (this.formData.username.length < 3) {
      this.errorMessage = 'El usuario debe tener al menos 3 caracteres';
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(this.formData.username)) {
      this.errorMessage = 'El usuario solo puede contener letras, números y guiones bajos';
      return;
    }

    if (this.formData.nombre.length < 2) {
      this.errorMessage = 'El nombre debe tener al menos 2 caracteres';
      return;
    }

    if (this.formData.telefono.length < 8) {
      this.errorMessage = 'El teléfono debe tener al menos 8 caracteres';
      return;
    }

    if (!/^[0-9+\-\s()]+$/.test(this.formData.telefono)) {
      this.errorMessage = 'El teléfono solo puede contener números, espacios, +, -, ( y )';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { password, confirmPassword, ...userData } = this.formData;
    const result = await this.authService.register(userData, password);
    
    this.isLoading = false;
    
    if (result.success) {
      this.registrationSuccess.emit('Usuario registrado exitosamente. Ya puedes iniciar sesión.');
      this.closeModal.emit();
    } else {
      this.errorMessage = result.message;
    }
  }

  private isFormValid(): boolean {
    return !!(this.formData.username && 
              this.formData.email && 
              this.formData.nombre && 
              this.formData.telefono &&
              this.formData.password &&
              this.formData.confirmPassword);
  }

  onClose() {
    this.closeModal.emit();
  }
}
