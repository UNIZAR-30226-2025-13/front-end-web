import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';


@Component({
  selector: 'app-admin',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-black flex flex-col items-center justify-center text-white">
      <div class="text-center mb-8">
        <p class="text-2xl">{{ nombreUsuario }}</p>
      </div>

      <div class="grid grid-cols-3 gap-10">
        <div class="bg-[var(--sponge)] rounded-lg p-4 flex flex-col items-center justify-center w-60 h-60 hover:bg-[var(--lightSponge)] cursor-pointer"
        [routerLink]="['/admin/gestionar-artistas/']">
          <img src="assets/artistas.png" alt="Gestionar artistas" class="w-15 h-15 mb-2">
          <span class="text-xl text-center">Gestionar<br>artistas</span>
        </div>
        <div class="bg-[var(--sponge)] rounded-lg p-4 flex flex-col items-center justify-center w-60 h-60 hover:bg-[var(--lightSponge)] cursor-pointer"
        [routerLink]="['/admin/gestionar-canciones/']">
          <img src="assets/canciones.png" alt="Gestionar canciones" class="w-15 h-15 mb-2">
          <span class="text-xl text-center">Gestionar<br>canciones</span>
        </div>
        <div class="bg-[var(--sponge)] rounded-lg p-4 flex flex-col items-center justify-center w-60 h-60 hover:bg-[var(--lightSponge)] cursor-pointer"
        [routerLink]="['/admin/gestionar-albumes/']">
          <img src="assets/albumes.png" alt="Gestionar álbumes" class="w-15 h-15 mb-2">
          <span class="text-xl text-center">Gestionar<br>álbumes</span>
        </div>
        <div class="bg-[var(--sponge)] rounded-lg p-4 flex flex-col items-center justify-center w-60 h-60 hover:bg-[var(--lightSponge)] cursor-pointer"
        [routerLink]="['/admin/gestionar-podcasters/']">
          <img src="assets/podcasters.png" alt="Gestionar podcasters" class="w-15 h-15 mb-2">
          <span class="text-xl text-center">Gestionar<br>podcasters</span>
        </div>
        <div class="bg-[var(--sponge)] rounded-lg p-4 flex flex-col items-center justify-center w-60 h-60 hover:bg-[var(--lightSponge)] cursor-pointer">
          <img src="assets/episodios.png" alt="Gestionar episodios" class="w-15 h-15 mb-2">
          <span class="text-xl text-center">Gestionar<br>episodios</span>
        </div>
        <div class="bg-[var(--sponge)] rounded-lg p-4 flex flex-col items-center justify-center w-60 h-60 hover:bg-[var(--lightSponge)] cursor-pointer"
        [routerLink]="['/admin/gestionar-podcasts/']">
          <img src="assets/podcasts.png" alt="Gestionar pódcasts" class="w-15 h-15 mb-2">
          <span class="text-xl text-center">Gestionar<br>pódcasts</span>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class AdminComponent {

  nombreUsuario: string = 'Cargando...';
  correo: string = 'Cargando...';
  contraseña: string = '********';

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    const usuario = this.usuarioService.getUsuario();
    this.nombreUsuario = usuario ? usuario.nombre : 'Usuario desconocido';
    this.correo = usuario ? usuario.correo : 'Correo desconocido';
    this.contraseña = usuario ? usuario.contraseña : 'Contraseña desconocida';
  }


}
