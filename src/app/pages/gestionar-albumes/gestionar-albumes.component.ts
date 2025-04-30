import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BusquedaService } from '../../services/busqueda.service';
import { Subscription, forkJoin, map, catchError, of } from 'rxjs';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-gestionar-albumes',
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-black text-white pt-8">
      
      <!-- Banner superior morado -->
      <div class="bg-[var(--sponge)] text-white px-8 py-4 flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
          <img src="assets/albumes.png" class="w-8 h-8" alt="Icono albumes" />
          <h1 class="text-3xl uppercase tracking-wide font-semibold">ÁLBUMES</h1>
          <button class="bg-[var(--sponge)] text-white text-lg font-medium rounded-full px-4 py-1 border-3 border-white hover:bg-[var(--lightSponge)] transition"
          [routerLink]="['/gestionar-albumes/nuevo']"> 
            + Nuevo
          </button>
        </div>

        <div class="relative">
          <img 
            src="assets/search.png" 
            class="absolute w-12 h-12 top-1/2 left-4 transform -translate-y-1/2 text-white"
            alt="Buscar"
          />
          <input
            type="text"
            [(ngModel)]="busqueda"
            (ngModelChange)="onBusquedaChange()"
            placeholder="Buscar..."
            class="bg-[var(--button)] rounded-full pl-16 py-1 h-15 w-90 text-white placeholder-gray-400 focus:outline-none"
          />
        </div>
      </div>

      @if (busqueda.trim() == '') {
        <div class="flex items-center justify-center h-screen">
          <p class="text-2xl text-white">¡ Busca un álbum o crea uno nuevo !</p>
        </div>
      }


      <!-- Lista de albumes -->
      @if (busqueda.trim() !== '') {
        <div class="px-10">
          <div class="grid grid-cols-5 gap-6">
            <div *ngFor="let album of albums" class="flex flex-col items-center transition-transform duration-300 hover:scale-97 cursor-pointer">
              <img
                [src]="album.image"
                [alt]="album.name"
                class="w-64 h-64 object-cover rounded-xl mb-2"
                [routerLink]="['/gestionar-albumes/editar/', album.id]"
              />
              <span class="text-xl text-center font-semibold break-words line-clamp-2">{{ album.name }}</span>

            </div>
          </div>
        </div>
      }

    </div>
  `,
  styles: ``
})
export class GestionarAlbumesComponent {
  busqueda: string = '';

  albums: any[] = [];
  
  subscription!: Subscription;
  
  constructor(
    private authService: AuthService,
    private busquedaService: BusquedaService
  ) {}

  onBusquedaChange() {
    const cadena = this.busqueda.trim();
  
    if (cadena !== '') {
      this.getAlbums(cadena).subscribe(albums => {
        this.albums = albums;
      });
    } else {
      this.albums = [];
    }
  }  


  ngOnInit() {
    this.subscription = this.busquedaService.cadenaBusqueda$.subscribe(nuevaCadena => {
      if (nuevaCadena.trim() !== '') { 
        forkJoin({
          albums: this.getAlbums(nuevaCadena)
        }).subscribe(resultados => {
          // Aquí se actualizan los valores después de recibir todos los datos
          this.albums = resultados.albums;
          console.log('Todos los resultados obtenidos:', resultados);
        });
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getAlbums(name: string) {
    return this.authService.searchAlbum(name).pipe(
      map((response: any) => response.length > 0 ? response.map((album: any) => ({
        id: album.id_album,
        name: album.nombre_album,
        image: album.link_imagen,
        date: album.fecha_pub,
        artist: album.artista
      })) : []),
      catchError(err => {
        console.error('Error al obtener álbumes:', err);
        return of([]);
      })
    );
  }


}
