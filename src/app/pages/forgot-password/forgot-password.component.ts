import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'

@Component({
  selector: 'app-forgot-password',
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
          <h2 class="text-3xl font-bold text-white text-center mb-6">¿Has olvidado tu contraseña?</h2>

          <form (submit)="onForgotPassword()" class="space-y-4">
            <!-- Campo de Nombre de Usuario con Icono -->
            <div class="relative">
              <span class="absolute inset-y-0 left-3 flex items-center text-gray-500">
                <img src="assets/email.png" alt="Usuario" class="w-5 h-5">
              </span>
              <input type="text" [(ngModel)]="email" name="email" placeholder="Correo Electrónico"
                class="w-full pl-10 p-3 rounded-3xl bg-gray-200 focus:outline-none">
            </div>

            <!-- Botón de Iniciar Sesión -->
            <button type="submit"
              class="w-full bg-[var(--sponge)] hover:bg-purple-400 text-white p-3 rounded-3xl font-bold border-white max-md:border-1">
              Enviar Correo
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class ForgotPasswordComponent {
  email = '';

  constructor(private router: Router) {}

  onForgotPassword() {
    // No esta hecha
  }
}
