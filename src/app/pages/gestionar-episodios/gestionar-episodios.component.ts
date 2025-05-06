import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BusquedaService } from '../../services/busqueda.service';
import { Subscription, forkJoin, map, catchError, of } from 'rxjs';
import { RouterModule } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-gestionar-episodios',
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-black text-white pt-8">
      
      <!-- Banner superior morado -->
      <div class="bg-[var(--sponge)] text-white px-8 py-4 flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
          <img src="assets/episodios.png" class="w-8 h-8" alt="Icono episodios" />
          <h1 class="text-3xl uppercase tracking-wide font-semibold">EPISODIOS</h1>
          <button class="bg-[var(--sponge)] text-white text-lg font-medium rounded-full px-4 py-1 border-3 border-white hover:bg-[var(--lightSponge)] transition"
          [routerLink]="['/admin/gestionar-episodios/nuevo']">
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
          <p class="text-2xl text-white">Busca un episodio o crea uno nuevo</p>
        </div>
      }

      <!-- Lista de episodios -->
      @if (busqueda.trim() !== '') {
        <div class="grid grid-cols-43 gap-4 text-left text-white pl-40">
            <div class="font-bold col-span-14">Título</div>
            <div class="font-bold col-span-8">Podcast</div>
            <div class="font-bold col-span-6">Valoración media</div>
            <div class="font-bold col-span-8">Fecha publicación</div>
            <div class="font-bold col-span-6">Duración</div>
        </div>

        <hr class="border-t-2 border-white my-4 ">  
        <div *ngFor="let episode of episodes"
          class="grid grid-cols-43 gap-4 pl-40 text-white items-center hover:bg-gray-500/20 rounded-[10px] transition-transform duration-300 hover:scale-101 cursor-pointer"
          [routerLink]="['/admin/gestionar-episodios/editar/', episode.id]">
            <div class="flex m-2 col-span-14 ">
          
              <div class="relative w-[44px] h-[44px] group mr-5 min-w-[44px]">
              <!-- Imagen del episodio -->
                <img [src]="episode.imagen" alt="Icono del episodio"
                class="w-full h-full rounded-[10px] object-cover flex-shrink-0"> 
              </div>

              <!-- Título y descripcion del episodio -->
              <div class="flex flex-col min-w-0">
                <p class="font-montserrat font-bold text-lg text-white cursor-pointer">
                  {{ episode.titulo  }}
                </p>
              
                <div class="flex flex-row w-full overflow-hidden whitespace-nowrap ">
                  <p class="text-white text-sm hover:underline min-w-fill max-w-full">{{episode.descripcion}}</p>
                </div>

              </div>
            </div>

            <!-- Podcast -->
            <div class="col-span-8">
              {{episode.podcast_nombre}}
            </div>


            <!-- Valoración media -->
            <div class="flex gap-1 col-span-6">
                <ng-container> 
                    <img *ngFor="let star of generateStars(episode.valoracion_media)" [src]="star" alt="star" class="w-5 h-auto "/>
                    <script src="script.js"></script>
                </ng-container> 
            </div>  
          
            <!-- Fecha de publicación -->
            <div class="col-span-8">
              {{ formatFecha(episode.fecha_pub) }}
            </div> 

            <!-- Duración -->
            <div class="col-span-6">
              {{ formatDurationEpisode(episode.duracion) }}
            </div>

        </div> 
      }
  `,
  styles: ``
})
export class GestionarEpisodiosComponent {
  busqueda: string = '';

  episodes: any[] = [];
  
  subscription!: Subscription;

  constructor(
    private authService: AuthService,
    private busquedaService: BusquedaService
  ) {}

  encodeNombreArtista(nombre: string): string {
    return encodeURIComponent(nombre);
  }

  onBusquedaChange() {
    console.log('Buscando:', this.busqueda); 
    const cadena = this.busqueda.trim();
  
    if (cadena !== '') {
      this.getEpisodios(cadena).subscribe(episodes => {
        this.episodes = episodes;
        console.log('Episodios encontrados:', episodes); 
      });
    } else {
      this.episodes = [];
    }
  }  

  
  ngOnInit() {
    this.subscription = this.busquedaService.cadenaBusqueda$.subscribe(nuevaCadena => {
      console.log('Cadena recibida desde servicio de búsqueda:', nuevaCadena);
      if (nuevaCadena.trim() !== '') { 
        forkJoin({
          episodes: this.getEpisodios(nuevaCadena)
        }).subscribe(resultados => {
          this.episodes = resultados.episodes;
          console.log('Todos los resultados obtenidos:', resultados);
        });
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getEpisodios(name: string) {
    return this.authService.searchMultimedia(name).pipe(
      map((response: any) => {
        console.log('🔍 Respuesta completa de searchMultimedia:', response);
  
        if (!response || !Array.isArray(response.top10Completo)) {
          console.warn('top10Completo no existe o no es un array');
          return [];
        }
  
        const episodios = response.top10Completo.filter((item: any) => {
          console.log('Item tipo:', item.tipo);
          return item.tipo?.toLowerCase() === 'Episodio';  // <-- Asegura que comparas en minúsculas
        });
  
        console.log('Episodios encontrados tras filtro:', episodios);
  
        return episodios.map((ep: any) => ({
          id: ep.id_cm,
          titulo: ep.titulo,
          imagen: ep.link_imagen,
          duracion: ep.duracion,
          fecha_pub: ep.fecha_pub,
          podcast_nombre: ep.podcast
        }));
      }),
  
      switchMap((episodes: any[]) => {
        if (episodes.length === 0) return of([]);
  
        const requests = episodes.map(ep =>
          forkJoin({
            description: this.authService.getEpisode(ep.id).pipe(
              map((res: any) => res.descripcion),
              catchError(() => of(null))
            ),
            rating: this.authService.getAverageRate(ep.id).pipe(
              map((res: any) => res.valoracion_media),
              catchError(() => of(null))
            )
          }).pipe(
            map(({ description, rating }) => {
              const result = {
                ...ep,
                descripcion: description,
                valoracion_media: rating
              };
              console.log('Episodio procesado:', result);
              return result;
            })
          )
        );
  
        return forkJoin(requests);
      }),
  
      catchError(err => {
        console.error('Error en getEpisodios:', err);
        return of([]);
      })
    );
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
      stars.push("assets/half-star.png");
    }
  
    for (let i = 0; i < emptyStars; i++) {
      stars.push("assets/star_empty.png");
    }
  
    return stars;
  }

  formatDurationEpisode(duration: string): string {
    const parts = duration.split(':');
    return parts.length === 3 && parts[0] === '00' ? `${parts[1]}:${parts[2]}` : duration;
  }
 
  formatFecha(fechaString: string): string {
    const fecha = new Date(fechaString);
    const opciones: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return fecha.toLocaleDateString('es-ES', opciones);  
  }


}
