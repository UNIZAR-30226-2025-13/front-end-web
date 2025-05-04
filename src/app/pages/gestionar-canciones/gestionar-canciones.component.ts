import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BusquedaService } from '../../services/busqueda.service';
import { Subscription, forkJoin, map, catchError, of } from 'rxjs';
import { RouterModule } from '@angular/router';
import { switchMap } from 'rxjs';


@Component({
  selector: 'app-gestionar-canciones',
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-black text-white pt-8">
      
      <!-- Banner superior morado -->
      <div class="bg-[var(--sponge)] text-white px-8 py-4 flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
          <img src="assets/canciones.png" class="w-8 h-8" alt="Icono canciones" />
          <h1 class="text-3xl uppercase tracking-wide font-semibold">CANCIONES</h1>
          <button class="bg-[var(--sponge)] text-white text-lg font-medium rounded-full px-4 py-1 border-3 border-white hover:bg-[var(--lightSponge)] transition"
          [routerLink]="['/admin/gestionar-canciones/nuevo']">
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
          <p class="text-2xl text-white">Busca una canción o crea una nueva</p>
        </div>
      }

      <!-- Lista de canciones -->
      @if (busqueda.trim() !== '') {
        <div class="grid grid-cols-43 gap-4 text-left text-white pl-40">
            <div class="font-bold col-span-8">Título</div>
            <div class="font-bold col-span-8">Álbum</div>
            <div class="font-bold col-span-6">Reproducciones</div>
            <div class="font-bold col-span-6">Valoración media</div>
            <div class="font-bold col-span-8">Fecha publicación</div>
            <div class="font-bold col-span-6">Duración</div>
        </div>

        <hr class="border-t-2 border-white my-4 ">  
        <div *ngFor="let song of songs"
          class="grid grid-cols-43 gap-4 pl-40 text-white items-center hover:bg-gray-500/20 rounded-[10px] transition-transform duration-300 hover:scale-101 cursor-pointer"
          [routerLink]="['/admin/gestionar-canciones/editar/', song.id]">
            <div class="flex m-2 col-span-8 ">
          
              <div class="relative w-[44px] h-[44px] group mr-5 min-w-[44px]">
              <!-- Imagen de la canción -->
                <img [src]="song.image" alt="Icono de la canción"
                class="w-full h-full rounded-[10px] object-cover flex-shrink-0"> 
              </div>

              <!-- Título y artista de la canción -->
              <div class="flex flex-col min-w-0">
                <p class="font-montserrat font-bold text-lg text-white cursor-pointer">
                  {{ song.title  }}
                </p>
              
                <div class="flex flex-row w-full overflow-hidden whitespace-nowrap ">
                  <p class="text-white text-sm hover:underline min-w-fill max-w-full">{{song.artist}}</p>
                  <!-- Featurings -->
                  <div *ngIf="song.featurings != null">
                    @for(ft of getArtistasFeat(song); track ft) {
                      <p class="text-white text-sm inline-block min-w-max">,&nbsp;</p>
                      <p class="text-white text-sm hover:underline inline-block min-w-max">
                        {{ ft }}
                      </p>
                    }
                  </div>

                </div>
              </div>
            </div>

            <!-- Álbum -->
            <div class="col-span-8">
              {{song.album_nombre}}
            </div>

            <!-- Reproducciones -->
            <div class="col-span-6">
              {{ song.reproducciones }}
            </div>

            <!-- Valoración media -->
            <div class="flex gap-1 col-span-6">
                <ng-container> 
                    <img *ngFor="let star of generateStars(song.valoracion)" [src]="star" alt="star" class="w-5 h-auto "/>
                    <script src="script.js"></script>
                </ng-container> 
            </div>  
          
            <!-- Fecha de publicación -->
            <div class="col-span-8">
              {{ formatFecha(song.releaseDate) }}
            </div> 

            <!-- Duración -->
            <div class="col-span-6">
              {{ formatDurationSong(song.duracion) }}
            </div>

        </div> 
      }




  `,
  styles: ``
})
export class GestionarCancionesComponent {
  busqueda: string = '';

  songs: any[] = [];
  
  subscription!: Subscription;

  constructor(
    private authService: AuthService,
    private busquedaService: BusquedaService
  ) {}

  encodeNombreArtista(nombre: string): string {
    return encodeURIComponent(nombre);
  }

  onBusquedaChange() {
    const cadena = this.busqueda.trim();
  
    if (cadena !== '') {
      this.getCanciones(cadena).subscribe(songs => {
        this.songs = songs;
      });
    } else {
      this.songs = [];
    }
  }  

  
  ngOnInit() {
    this.subscription = this.busquedaService.cadenaBusqueda$.subscribe(nuevaCadena => {
      if (nuevaCadena.trim() !== '') { 
        forkJoin({
          songs: this.getCanciones(nuevaCadena)
        }).subscribe(resultados => {
          this.songs = resultados.songs;
          console.log('Todos los resultados obtenidos:', resultados);
        });
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getCanciones(name: string) {
    return this.authService.searchMultimedia(name).pipe(
      map((response: any) => response.top10Completo?.length > 0
        ? response.top10Completo
            .filter((item: any) => item.tipo === 'Canción')
            .map((song: any) => ({
              id: song.id_cm,
              title: song.titulo,
              artist: song.cantante,
              image: song.link_imagen,
              duracion: song.duracion,
              releaseDate: song.fecha_pub,
              featurings: song.feat
            }))
        : []
      ),
  
      switchMap((songs: any[]) => {
        if (songs.length === 0) return of([]);
  
        const requests = songs.map(song =>
          // Paso 1: obtener cm, valoracion y reproducciones en paralelo
          forkJoin({
            cm: this.authService.showCM(song.id).pipe(catchError(() => of({ id_album: null }))),
            rating: this.authService.getAverageRate(song.id).pipe(catchError(() => of({ valoracion: null }))),
            plays: this.authService.showSong(song.id).pipe(catchError(() => of({ reproducciones: 0 })))
          }).pipe(
            // Paso 2: usar el id_album para obtener el nombre del álbum
            switchMap(({ cm, rating, plays }) => {
              const id_album = cm.id_album;
  
              if (!id_album) {
                return of({
                  ...song,
                  id_album: null,
                  album_nombre: null,
                  valoracion: rating.valoracion,
                  reproducciones: plays.reproducciones
                });
              }
  
              return this.authService.getInfoAlbum(id_album).pipe(
                map((albumInfo: any) => ({
                  ...song,
                  id_album: id_album,
                  album_nombre: albumInfo.album?.nombre ?? null,
                  valoracion: rating.valoracion,
                  reproducciones: plays.reproducciones
                })),
                catchError(() =>
                  of({
                    ...song,
                    id_album: id_album,
                    album_nombre: null,
                    valoracion: rating.valoracion,
                    reproducciones: plays.reproducciones
                  })
                )
              );
            })
          )
        );
  
        return forkJoin(requests);
      }),
  
      catchError(err => {
        console.error('Error al obtener canciones:', err);
        return of([]);
      })
    );
  }
  

  getArtistasFeat(cm: any): string[] {
    return cm.artistas_feat ? cm.artistas_feat.split(',').map((artista: string) => artista.trim()) : []; 
  }

  generateStars(rating: number | null): string[] {
    const stars = [];
  
    if (rating == null) {
      stars.push("assets/star_no_rate.png");
      return stars;
    }
  
    const r = rating;
    const fullStars = Math.floor(r);
    const hasHalfStar = r % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
    for (let i = 0; i < fullStars; i++) {
      stars.push("assets/star.png");
    }
  
    if (hasHalfStar) {
      stars.push("assets/half_star.png");
    }
  
    for (let i = 0; i < emptyStars; i++) {
      stars.push("assets/star_empty.png");
    }
  
    return stars;
  }
  

  formatDurationSong(duration: string): string {
    const parts = duration.split(':');
    return parts.length === 3 && parts[0] === '00' ? `${parts[1]}:${parts[2]}` : duration;
  }
 
  formatFecha(fechaString: string): string {
    const fecha = new Date(fechaString);
    const opciones: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return fecha.toLocaleDateString('es-ES', opciones);  
  }

  getReproducciones(id: string) {
    return this.authService.showSong(parseInt(id)).pipe(
      map((response: any) => response.reproducciones ?? 0),
      catchError(err => {
        console.error('Error al obtener reproducciones:', err);
        return of(0); 
      })
    );
    
  }
  


  
}
