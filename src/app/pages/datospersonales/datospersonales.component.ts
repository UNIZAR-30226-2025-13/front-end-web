import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { Subscription, forkJoin, map, catchError, of } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-datospersonales',
  template: `
    <div class="inset-0 flex items-center justify-center bg-black mt-10">
      <div class="w-1/2 h-170 p-6 rounded-[20px] bg-[var(--spongedark)] relative text-white text-center flex flex-col justify-between">

        <!-- Imagen de fondo del logo -->
        <div class="absolute inset-0 opacity-30 bg-cover bg-center rounded-[20px]"
            style="background-image: url('assets/mediologo.png');">
        </div>

        <!-- Título -->
        <div class="relative mt-8">
          <p class="text-2xl">Datos personales</p>
          <h2 class="text-4xl font-bold text-white">{{ nombreUsuario }}</h2> 
        </div>

        <!-- Información de usuario -->
        <div class="relative">
          <p class="text-xl font-semibold mb-3">Correo electrónico</p>
          <p class="text-gray-300 text-xl">{{ correo }}</p>

          <p class="text-xl font-semibold mb-3 mt-5">Contraseña</p>
          <p class="text-gray-300 text-xl">********</p>
        </div>

        <!-- Botón editar perfil-->
        <div class="relative">
          <button (click)="editarPerfil()" 
            class="border-2 border-white mb-10 rounded-full flex items-center px-6 py-2 justify-center hover:bg-white hover:text-[var(--spongedark)] transition mx-auto">
            <p class="font-montserrat font-semibold text-m">Editar perfil</p>
          </button>
        </div>

      </div>
    </div>

  `,
  styles: ``
})
export class DatospersonalesComponent implements OnInit {
  nombreUsuario: any = null;
  correo: string = 'Cargando...';
  contraseña: string = '********';

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private router: Router
  ) {}

  editarPerfil() {
    if (this.nombreUsuario) {
      this.router.navigate(['/inicio/editarperfil/', this.nombreUsuario]);
    }
  }

  ngOnInit() {

    const usuario = this.usuarioService.getUsuario();
    console.log('Usuario obtenido:', usuario);
    this.nombreUsuario = usuario ? usuario.nombre_usuario : 'Usuario desconocido';
    this.correo = usuario ? usuario.correo : 'Correo desconocido';
    this.contraseña = usuario ? usuario.contraseña : 'Contraseña desconocida';
  }


}
