import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  template: `
<div class="min-h-screen flex items-center justify-center bg-black relative">
  
  <!-- Imagen de Fondo (Visible en grandes, superpuesta en medianas/pequeñas) -->
  <div class="absolute inset-0 md:relative md:w-1/2 h-screen transition-all duration-500 ease-in-out">
    <img src="assets/mediologo.png" alt="Logo" class="w-full h-full object-cover md:block md:relative opacity-100 md:opacity-100">
  </div>

  <!-- Contenedor del Login -->
  <div class="w-full md:w-1/2 h-screen flex items-center justify-center p-8 relative z-10 md:bg-transparent">
    <div class="p-5 max-w-md w-full">
      <h2 class="text-3xl font-bold text-white text-center mb-6">Iniciar Sesión</h2>

      <form (submit)="onLogin()" class="space-y-4">
        <!-- Campo de Nombre de Usuario con Icono -->
        <div class="relative">
          <span class="absolute inset-y-0 left-3 flex items-center text-gray-500">
            <img src="assets/user.png" alt="Usuario" class="w-5 h-5">
          </span>
          <input type="text" [(ngModel)]="nombre_usuario" name="username" placeholder="Nombre de Usuario"
            class="w-full pl-10 p-3 rounded-3xl bg-gray-200 focus:outline-none">
        </div>

        <!-- Campo de Contraseña con Icono y Botón de Ver/Ocultar -->
        <div class="relative">
          <span class="absolute inset-y-0 left-3 flex items-center text-gray-500">
            <img src="assets/password.png?=v2" alt="Contraseña" class="w-5 h-5">
          </span>
          <input 
            [type]="passwordVisible ? 'text' : 'password'" 
            [(ngModel)]="contrasena" 
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
          Iniciar Sesión
        </button>
      </form>

      <!-- Enlaces de Recuperación y Registro -->
      <div class="text-center mt-4 text-white text-sm flex justify-between">
        <a routerLink="/register" class="hover:underline">¿Aún no tienes una cuenta?</a>
        <a routerLink="/forgot-password" class="hover:underline">He olvidado mi contraseña</a>
      </div>

      <hr class="my-6 border-t border-white">

      <!-- Botón de Inicio con Google -->
      <button class="w-full flex items-center justify-center p-3 rounded-3xl bg-gray-200 hover:bg-gray-300 mt-4">
        <img src="assets/google-icon.svg" alt="Google" class="w-6 h-6 mr-2">
        Iniciar Sesión con Google
      </button>
    </div>
  </div>
</div>
  `,
  styles: [`
    input {
      transition: all 0.3s ease-in-out;
    }
    input:focus {
      outline: none;
      box-shadow: 0px 0px 8px rgba(255, 255, 255, 0.4);
    }
  `]
})
export class LoginComponent {
  nombre_usuario: string = '';
  contrasena: string = '';
  passwordVisible = false;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  onLogin() {
    const loginData = { nombre_usuario: this.nombre_usuario, contrasena: this.contrasena };

    this.authService.login(loginData).subscribe({
      next: (response: any) => {
        console.log('Inicio de sesión exitoso', response);
        
        localStorage.setItem('token', response.token);
        this.usuarioService.guardarUsuario(response.usuario);

        this.router.navigate(['/inicio/todo']);
      },
      error: (error) => {
        console.error('Error en el inicio de sesión', error);
        alert('Credenciales incorrectas');
      }
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
