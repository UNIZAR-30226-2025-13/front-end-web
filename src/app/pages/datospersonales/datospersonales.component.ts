import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-datospersonales',
  template: `
    <div class="h-screen flex items-center justify-center bg-black">
      <div class="w-[600px] h-[500px] p-6 rounded-[20px] bg-[var(--spongedark)] relative text-white text-center flex flex-col justify-between">

        <!-- Imagen de fondo del logo -->
        <div class="absolute inset-0 opacity-30 bg-cover bg-center rounded-[20px]"
            style="background-image: url('assets/mediologo.png');">
        </div>

        <!-- Título -->
        <div class="relative mt-8">
          <h2 class="text-2xl font-bold">{{ nombreUsuario }}</h2>
          <p class="text-sm">Datos personales</p>
        </div>

        <!-- Información de usuario -->
        <div class="relative">
          <p class="text-sm font-semibold">Correo electrónico</p>
          <p class="text-gray-300 text-sm">{{ correo }}</p>

          <p class="text-sm font-semibold mt-4">Contraseña</p>
          <p class="text-gray-300 text-sm">********</p>
        </div>

        <!-- Botón -->
        <div class="relative">
          <button (click)="editarPerfil()" 
            class="border-2 border-white rounded-full flex items-center px-6 py-2 justify-center hover:bg-white hover:text-[var(--spongedark)] transition mx-auto">
            <p class="font-montserrat font-bold text-sm">Editar perfil</p>
          </button>
        </div>

      </div>
    </div>

  `,
  styles: [``]
})
export class DatospersonalesComponent implements OnInit {
  nombreUsuario: string = 'Cargando...';
  correo: string = 'Cargando...';
  contraseña: string = '********';

  constructor(private usuarioService: UsuarioService) {}

  editarPerfil() {}

  ngOnInit() {
    const usuario = this.usuarioService.getUsuario();
    this.nombreUsuario = usuario ? usuario.nombre : 'Usuario desconocido';
    this.correo = usuario ? usuario.correo : 'Correo desconocido';
    this.contraseña = usuario ? usuario.contraseña : 'Contraseña desconocida';
  }
}
