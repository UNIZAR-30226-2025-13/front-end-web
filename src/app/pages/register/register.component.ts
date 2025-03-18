import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  template: `
  <div class="min-h-screen flex items-center justify-center bg-black relative">

    <!-- Imagen de Fondo (Visible en grandes, superpuesta en medianas/pequeñas) -->
    <div class="absolute inset-0 md:relative md:w-1/2 h-screen transition-all duration-500 ease-in-out">
      <img src="assets/mediologo.png" alt="Logo" class="w-full h-full object-cover md:block md:relative opacity-100 md:opacity-100">
    </div>

    <!-- Contenedor del Login -->
    <div class="w-full md:w-1/2 h-screen flex items-center justify-center p-8 relative z-10 md:bg-transparent">
      <div class="p-8 max-w-md w-full">
        <h2 class="text-3xl font-bold text-white text-center mb-6">Registrarse</h2>

        <form (submit)="onRegister()" class="space-y-4">
          <!-- Campo de Nombre de Usuario con Icono -->
          <div class="relative">
            <span class="absolute inset-y-0 left-3 flex items-center text-gray-500">
              <img src="assets/user.png" alt="Usuario" class="w-5 h-5">
            </span>
            <input type="text" [(ngModel)]="username" name="username" placeholder="Nombre de Usuario"
              class="w-full pl-10 p-3 rounded-3xl bg-gray-200 focus:outline-none">
          </div>

          <div class="relative">
            <span class="absolute inset-y-0 left-3 flex items-center text-gray-500">
              <img src="assets/email.png" alt="Correo" class="w-5 h-5">
            </span>
            <input type="text" [(ngModel)]="correo" name="correo" placeholder="Correo electrónico"
              class="w-full pl-10 p-3 rounded-3xl bg-gray-200 focus:outline-none">
          </div>

          <!-- Campo de Contraseña con Icono y Botón de Ver/Ocultar -->
          <div class="relative">
            <span class="absolute inset-y-0 left-3 flex items-center text-gray-500">
              <img src="assets/password.png?=v2" alt="Contraseña" class="w-5 h-5">
            </span>
            <input 
              [type]="passwordVisible ? 'text' : 'password'" 
              [(ngModel)]="password" 
              name="password" 
              placeholder="Contraseña"
              class="w-full pl-10 p-3 rounded-3xl bg-gray-200 focus:outline-none">
            
            <button 
              type="button" 
              (click)="togglePasswordVisibility()" 
              class="absolute inset-y-0 right-3 flex items-center text-gray-500 focus:outline-none">
              <img 
                [src]="passwordVisible ? 'assets/closeeye.png' : 'assets/openeye.png'" 
                alt="Ver/Ocultar Contraseña" 
                class="w-5 h-5">
            </button>
          </div>


          <!-- Botón de Iniciar Sesión -->
          <button type="submit"
            class="w-full bg-[var(--sponge)] hover:bg-purple-400 text-white p-3 rounded-3xl font-bold border-white max-md:border-1">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  </div>
  `,
  styles: ``
})
export class RegisterComponent {
  username = '';
  password = '';
  correo = '';
  passwordVisible = false;

  constructor(private router: Router, private http: HttpClient) {} // 👈 Inyectar HttpClient

  onRegister() {
    if (!this.username || !this.correo || !this.password) {
      window.alert('Todos los campos son obligatorios.');
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.correo)) {
      window.alert('Por favor, introduce un correo electrónico válido.');
      return;
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(this.password)) {
      window.alert('La contraseña debe tener al menos 8 caracteres, con mayúsculas, minúsculas, números y símbolos especiales.');
      return;
    }

    const registroData = {
      nombre_usuario: this.username,
      correo: this.correo,
      contrasena: this.password
  };
  
  this.http.post('http://localhost:8080/register', registroData, {
        headers: { 'Content-Type': 'application/json' }
    }).subscribe({
        next: (response) => {
            console.log('¡Registro exitoso!', response);
            this.router.navigate(['/login']);
            
        },
        error: (error) => {
            console.error('Error en el registro:', error);
            window.alert('Hubo un problema con el registro: ' + error.error.message);
        }
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}