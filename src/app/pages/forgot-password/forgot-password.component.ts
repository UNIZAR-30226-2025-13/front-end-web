import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'
import { AuthService } from '../../services/auth.service';

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

          <form (submit)="onForgotPassword($event)" class="space-y-4">
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
  message = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onForgotPassword(event: Event) {
    event.preventDefault(); // Evitar recarga de la página

    if (!this.email) {
      this.message = "Por favor, ingresa tu correo electrónico.";
      return;
    }
    console.log(this.email)

    this.authService.sendEmail(this.email).subscribe({
      next: (response: any) => {
        this.message = "Correo enviado con éxito. Revisa tu bandeja de entrada.";
        setTimeout(() => {
          this.router.navigate(['/change-password']);
        }, 2000);
      },
      error: (error) => {
        console.error("Error al enviar el correo:", error);
        this.message = "Error al enviar el correo. Inténtalo de nuevo.";
      }
    });
  }
}
