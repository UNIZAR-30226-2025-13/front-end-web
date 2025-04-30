import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editar-perfil',
  standalone: true, 
  imports: [FormsModule], 
  template: `
    <div class="inset-0 flex items-center justify-center bg-black mt-10">
      <div class="w-1/2 h-170 p-6 rounded-[20px] bg-[var(--spongedark)] relative text-white text-center flex flex-col justify-between">

        <!-- Imagen de fondo -->
        <div class="absolute inset-0 opacity-30 bg-cover bg-center rounded-[20px]"
            style="background-image: url('assets/mediologo.png');">
        </div>

        <!-- Título -->
        <div class="relative mt-8">
          <p class="text-2xl">Datos personales</p>
          <h2 class="text-4xl font-bold text-white">{{ nombreUsuario }}</h2>
        </div>

        <!-- Información editable -->
        <div class="relative">
          <!-- Campo Correo -->
          <div>
            <p class="text-xl font-semibold mb-2">Correo electrónico</p>
            <input [(ngModel)]="correo" 
              type="email" 
              class="w-3/4 bg-[var(--sponge)] border border-white rounded-full px-4 py-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-white" />
          </div>

          <!-- Campo Contraseña -->
          <div>
            <p class="text-xl font-semibold mt-4 mb-2">Contraseña</p>
            <input [(ngModel)]="contrasena" 
              type="password" 
              placeholder="********"
              class="w-3/4 bg-[var(--sponge)] border border-white rounded-full px-4 py-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-white" />
          </div>
        </div>

        <!-- Botón guardar cambios -->
        <div class="relative">
          <button (click)="guardarCambios()" 
            class="border-2 border-white mb-10 rounded-full flex items-center px-6 py-2 justify-center hover:bg-white hover:text-[var(--spongedark)] transition mx-auto">
            <p class="font-montserrat font-semibold text-m">Guardar cambios</p>
          </button>
        </div>

      </div>
    </div>
  `,
  styles: ``
})
export class EditarPerfilComponent implements OnInit {
  nombreUsuario: string = 'Cargando...';
  correo: string = 'Cargando...';
  contrasena: string = '********';

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const usuario = this.usuarioService.getUsuario();
    this.nombreUsuario = usuario ? usuario.nombre_usuario : 'Usuario desconocido';
    this.correo = usuario ? usuario.correo : 'Correo desconocido';
    this.contrasena = usuario ? usuario.contraseña : 'Contraseña desconocida';
  }

  guardarCambios() {
    const usuario = this.usuarioService.getUsuario();
  
    if (!usuario) {
      console.error('No se pudo obtener el usuario');
      return;
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(this.contrasena)) {
      window.alert('La contraseña debe tener al menos 8 caracteres, con mayúsculas, minúsculas, números y símbolos especiales.');
      return;
    }
  
    this.authService.updateProfile(usuario.nombre_usuario, this.correo, this.contrasena)
      .subscribe({
        next: () => {
          console.log('Perfil actualizado correctamente');
          alert('¡Perfil actualizado con éxito!');
        },
        error: (err) => {
          console.error('Error al actualizar perfil:', err);
          alert('Hubo un error al actualizar el perfil');
        }
      });
  }
  
}
