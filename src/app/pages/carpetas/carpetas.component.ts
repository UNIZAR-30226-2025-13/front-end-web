import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-carpetas',
  imports: [RouterModule, CommonModule],
  template: `
    <div class="bg-black h-auto p-7">
    <div class="flex flex-row items-center justify-between mb-5">
      <div class="flex flex-row items-center">
        <img src="assets/folder.png" class="w-[40px] h-[40px] mr-2">
        <p class="text-white font-extrabold text-[40px]"> {{ carpeta.nombre_carpeta }}</p>
      </div>
      <button 
        (click)="eliminarCarpeta()"
        class="flex flex-row gap-1 items-center bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-lg transition-transform duration-200 hover:scale-110"
      >
        <img src="assets/trash.png" class="w-5 h-5"> Eliminar
      </button>
    </div>
    <div class="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-x-2">
        <div *ngFor="let lista of carpeta.listas; let i = index" class="relative group w-[210px]">
          <div
            class="bg-[var(--sponge)] w-[200px] h-[200px] rounded-[40px] flex items-end justify-start overflow-visible transition-transform duration-300 hover:scale-105 cursor-pointer mb-5"
            [ngStyle]="{'background-color': (lista.color === '#000000') ? '#FFFFFF' : lista.color}" 
            [routerLink]="['/inicio/lista_reproduccion/', lista.id_lista]"
          >
            <p class="text-black font-extrabold text-left text-[34px] mb-5 ml-[-2px] p-0 leading-none"
              style="word-break: break-word; white-space: normal;">
              {{ lista.nombre }}
            </p>
          </div>

          <!-- Botón de eliminación sobre la lista -->
          <button 
            (click)="eliminarDeLista(lista.id_lista)"
            class="absolute top-2 right-2 bg-red-600 text-white rounded-[10px] p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <img src="assets/trash.png" class="w-5 h-5">
          </button>
        </div>
      </div>
  </div>
  `,
  styles: ``
})
export class CarpetasComponent implements OnInit {
  
  carpeta: any = null;
  id_carpeta: any = '';

  constructor (
    private router: Router,
    private titleService: Title,
    private authService: AuthService,
    private route: ActivatedRoute,
    private usuario: UsuarioService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.id_carpeta = this.route.snapshot.paramMap.get('id_carpeta') ?? '';

      this.authService.getFolder(this.id_carpeta).subscribe({
        next: (data) => {
          if (data) {
            this.titleService.setTitle(`${data.nombre_carpeta} | Spongefy`);
            this.carpeta = data;
          }
        }
      });
    });
  }

  eliminarCarpeta() {
    if (confirm(`¿Estás seguro de que deseas eliminar la carpeta "${this.carpeta.nombre_carpeta}". Las listas asociadas a las carpetas no se borrarán?`)) {
      this.authService.deleteFolder(this.usuario.getUsuario()?.nombre_usuario, this.id_carpeta).subscribe({
        next: () => {
          alert('Carpeta eliminada correctamente');
          this.router.navigate(['/inicio']); // Redirige al usuario a la página principal
        },
        error: (err) => {
          console.error('Error eliminando carpeta:', err);
          alert('Ocurrió un error al eliminar la carpeta.');
        }
      });
    }
  }

  eliminarDeLista(id_lista: number) {
    if (confirm(`¿Quieres eliminar esta lista de la carpeta? La lista no se borrará completamente`)) {
      this.authService.deleteListFromFolder(this.usuario.getUsuario()?.nombre_usuario, this.id_carpeta, id_lista).subscribe({
        next: () => {
          // Filtrar la lista eliminada y actualizar la vista sin recargar
          this.carpeta.listas = this.carpeta.listas.filter((lista: any) => lista.id_lista !== id_lista);
        },
        error: (err) => {
          console.error('Error eliminando la lista de la carpeta:', err);
          alert('No se pudo eliminar la lista de la carpeta.');
        }
      });
    }
  }
}
