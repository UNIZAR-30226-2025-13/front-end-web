import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, Renderer2, ViewChild, NgZone } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterModule, Router } from '@angular/router'
import localeEs from '@angular/common/locales/es';
import { PlayerService } from '../../services/player.service';

registerLocaleData(localeEs, 'es-ES');


// @ts-ignore
import ColorThief from 'colorthief';

@Component({
  selector: 'app-artista',
  imports: [CommonModule, RouterModule],
  template: `
  
    @if (!artistNotFound) {
    <div #container class="bg-black pt-4 px-[34px] h-min-full w-full">
      <div class="flex bg-opacity-60 p-4 rounded-[40px] items-end" [ngStyle]="{'background-color': dominantColor}">
        <img [src]="img_artiste" alt="Imagen del artista" id="artistImage" class="max-sm:hidden rounded-[20px] h-[200px] w-[200px] object-cover">
        <div class="pl-[14px]">
          <div class="flex items-center">
            <p class="text-white text-[14px]">{{ type }}</p>
            <img src="assets/certification.png" alt="Certificación" class="w-[14px] h-[14px] ml-2">
          </div>
          <h1 class="font-montserrat font-bold text-4xl ml-[-2px] text-white">{{ artista.nombre_artista }}</h1>
          <div class="flex items-center mt-2">
            <button (click)="follow()" class="bg-[var(--sponge)] border border-white rounded-full flex items-center px-4 py-1 mr-4">
              <img src="assets/plus.png" alt="Seguir" class="w-4 h-4 mr-2">
              <p class="font-montserrat font-bold text-sm text-white">Seguir</p>
            </button>
            <p class="text-white text-base max-sm:hidden">{{ artista.seguidores | number:'1.0-0':'es-ES' }} seguidores</p>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap pt-[35px] w-full" [ngClass]="{'flex-col': this.anchoReal < 1400, 'flex-row': !(this.anchoReal < 1400)}">
        <!-- Sección de las más reproducidas -->
        <div class="pr-20 max-xl:pr-0"
        [ngClass]="{'w-full': this.anchoReal < 1400, 'w-3/5': !(this.anchoReal < 1400)}">
          <h2 class="font-montserrat font-bold text-2xl text-white mb-5">
              Las más reproducidas
          </h2>
          <div>
            <div *ngFor="let song of this.max_rep" class="grid grid-cols-12 gap-4 items-center mb-4">
              
              <!-- Contenedor de la imagen, título y artista -->
              <div class="col-span-8 flex items-center">
                <div class="relative w-[44px] h-[44px] group mr-5 min-w-[44px]" (click)="playSong(song)">
                    <!-- Imagen de la canción -->
                    <img [src]="song.link_imagen" alt="Icono de la canción"
                        class="w-full h-full rounded-[10px] object-cover flex-shrink-0">

                    <!-- Capa oscura con icono de Play -->
                    <div class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-[10px]">
                        <img src="assets/play.png" alt="Play"
                            class="w-6 h-6 cursor-pointer">
                    </div>
                </div>
                <!-- Título y Artista en columna -->
                <div class="flex flex-col">
                  <p class="font-montserrat font-bold text-lg text-white">
                      {{ song.titulo }}
                  </p>
                  <div class="flex flex-row">
                    <p [routerLink]="['/inicio/artista/', encodeNombreArtista(song.nombre_artista)]" 
                      class="text-white text-sm hover:underline inline-block min-w-max">
                        {{ song.nombre_artista }}
                    </p> 
                    <ng-container *ngIf="song.artistas_feat != null">
                      <ng-container *ngFor="let ft of getArtistasFeat(song); track by ft">
                        <p class="text-white text-sm inline-block min-w-max">,&nbsp;</p>
                        <p [routerLink]="['/inicio/artista/', encodeNombreArtista(ft)]" 
                          class="text-white text-sm hover:underline inline-block min-w-max">
                          {{ ft }}
                        </p>
                      </ng-container>
                    </ng-container>
                  </div>
                </div>
              </div>
              
              <!-- Número y duración de la canción -->
              <p class="col-span-2 max-sm:hidden text-white whitespace-nowrap text-right">
                  {{ song.n_repros | number:'1.0-0':'es-ES' }}
              </p>
              <p class="col-span-2 max-sm:hidden text-white whitespace-nowrap text-right">
                  {{ formatDuration(song.duracion) }}
              </p> 
            </div>
          </div>
        </div>

        <!-- Sección de "This is" -->
        <div class="flex flex-col justify-center"
        [ngClass]="{'w-full': this.anchoReal < 1400, 'w-2/5': !(this.anchoReal < 1400)}">>
          <h2 class="font-montserrat font-bold text-2xl text-white mb-5">
            Todas las canciones
          </h2>
          
          <button (click)="this_is()" class="flex flex-row items-end text-left">
            
            <div class="relative w-[288px] h-[288px] min-w-[288px] min-h-[288px]">
              <img [src]="img_artiste" alt="Imagen del artista" 
                  class="w-[288px] h-[288px] rounded-[40px] object-cover opacity-25">
              <img src="assets/heart.png" alt="Corazón" 
                  class="absolute top-[25%] left-[25%] w-40">
            </div>
            
            <h2 class="max-sm:hidden font-montserrat font-bold text-6xl text-white ml-[18px] w-80">
              This is {{ artista.nombre_artista }}
            </h2>        
          </button>
        </div>
      </div>

      <div class="mt-[20px] pb-10">
        <h2 class="font-montserrat font-bold text-2xl text-white mb-5">Lanzamientos</h2>
        <!-- Botones de Tab -->
        <div class="flex mb-5">
            <button (click)="setTab('album')" 
                class="bg-[var(--button)] rounded-full flex items-center px-4 py-1 mr-4"
                [ngClass]="{'bg-[var(--buttonhover)]': selectedTab === 'album'}">
                <p class="font-montserrat font-bold text-sm text-white">Álbumes</p>
            </button>
            <button (click)="setTab('cancion')" 
                class="bg-[var(--button)] rounded-full flex items-center px-4 py-1"
                [ngClass]="{'bg-[var(--buttonhover)]': selectedTab === 'cancion'}">
                <p class="font-montserrat font-bold text-sm text-white">Canciones</p>
            </button>
        </div>

        <!-- Vista de Álbumes (Fila larga con scroll horizontal) -->
        <div *ngIf="selectedTab === 'album'" 
            class="h-60 flex overflow-x-auto whitespace-nowrap scrollbar-hide space-x-4 pb-4">
            <div *ngFor="let album of this.artista.albumes" class="flex flex-col items-center flex-none max-w-44">
                <img [src]="album.link_imagen" [alt]="album.nombre_album" class="h-44 w-44 rounded-[40px] object-cover">
                <p class="text-white mt-2 font-bold line-clamp-2 max-w-44">{{ album.nombre_album }}</p>
            </div>
        </div>

        <!-- Vista de Canciones (Fila larga con scroll horizontal) -->
        <div *ngIf="selectedTab === 'cancion'" 
            class="h-60 flex overflow-x-auto whitespace-nowrap scrollbar-hide space-x-4 pb-4">
            <div *ngFor="let cancion of this.artista.canciones" class="flex flex-col items-center flex-none max-w-44">
                <img [src]="cancion.link_imagen" [alt]="cancion.titulo" class="h-44 w-w-44 rounded-[40px] object-cover">
                <p class="text-white mt-2 font-montserrat font-bold line-clamp-2 max-w-44 h-auto">{{ cancion.titulo }}</p>
                <p class="text-white text-sm line-clamp-2 max-w-44">{{ cancion.nombre_artista }}</p>
            </div>
        </div>
      </div>
      </div>
    } @else {
      <div class="bg-black pt-4 px-[34px] h-full">
        <div class="text-center py-20">
          <p class="text-white text-3xl font-bold">No se ha podido encontrar a {{ this.nombre_artista}}.</p>
          <p class="text-white text-lg mt-4">Intenta buscar otro nombre o revisa la conexión.</p>
        </div>
      </div>
    } 
  `,
  styles: ``
})
export class ArtistaComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('container', { static: false }) container!: ElementRef;

  artista: any = null;
  type: string = 'Artista';
  img_artiste: string = '';
  artistNotFound: boolean = false;
  nombre_artista = '';
  max_rep: any;
  dominantColor: string = 'rgba(75, 85, 99, 0.5)'; // Color gris predeterminado
  selectedTab: 'album' | 'cancion' = 'album';
  anchoReal: number = 0;
  private resizeObserver!: ResizeObserver;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private titleService: Title,
    private router: Router,
    private playerService: PlayerService,
    private renderer: Renderer2,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const nombre_artista_encoded = this.route.snapshot.paramMap.get('nombre_artista') ?? '';
      this.nombre_artista = decodeURIComponent(nombre_artista_encoded);
      this.titleService.setTitle(`${this.nombre_artista} | Spongefy`);

      this.authService.getArtist(nombre_artista_encoded).subscribe({
        next: (data) => {
          if (data) {
            this.artista = data;
            this.img_artiste = this.transformCloudinaryUrl(this.artista.link_imagen);
            this.max_rep = this.artista.canciones
              .sort((a: any, b: any) => b.n_repros - a.n_repros)
              .slice(0, 5);

            this.artistNotFound = false;
          } else {
            this.artistNotFound = true;
          }
        },
        error: (err) => {
          console.error('Error al obtener el perfil del artista:', err);
          this.artistNotFound = true;
        },
      });
    });

    // Extraer color dominante
    const imgElement = document.getElementById('artistImage') as HTMLImageElement;
    if (imgElement) {
      imgElement.crossOrigin = 'anonymous'; // Evita errores CORS
      if (imgElement.complete) {
        this.extractColor(imgElement);
      } else {
        imgElement.onload = () => this.extractColor(imgElement);
      }
    }
  }

  ngAfterViewInit() {
    // Obtener ancho inicial del componente
    this.anchoReal = this.container.nativeElement.offsetWidth;
    console.log(this.anchoReal);
    
    // Observador de cambio de tamaño
    this.resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        this.anchoReal = entry.contentRect.width;
        this.ngZone.run(() => {
          this.anchoReal = this.container.nativeElement.offsetWidth;
          console.log(this.anchoReal);
        });
      }
    });
    this.resizeObserver.observe(this.container.nativeElement);

  }

  ngOnDestroy() {
    this.resizeObserver.disconnect();
  }

  extractColor(imgElement: HTMLImageElement) {
    try {
      const colorThief = new ColorThief();
      if (imgElement.naturalWidth > 0) {
        const result = colorThief.getColor(imgElement);
        this.dominantColor = `rgba(${result[0]}, ${result[1]}, ${result[2]}, 0.5)`;
      }
    } catch (error) {
      console.error('Error al extraer el color dominante:', error);
    }
  }

  transformCloudinaryUrl(url: string): string {
    return url.includes('cloudinary.com') ? url.replace('/upload/', '/upload/f_auto,fl_lossy,fl_any_format/') : url;
  }

  follow() {}

  playSong(song: any) {
    this.authService.playSong(song.id_cancion).subscribe({
      next: (response: any) => {
        if (response && response.link_cm) {
          this.playerService.playSong(response);
        }
      },
      error: (err) => {
        console.error('Error al reproducir la canción:', err);
      },
    });
  }

  this_is() {}

  setTab(tab: 'album' | 'cancion') {
    this.selectedTab = tab;
  }

  getArtistasFeat(song: any): string[] {
    return song.artistas_feat ? song.artistas_feat.split(',').map((artista: string) => artista.trim()) : [];
  }

  encodeNombreArtista(nombre: string): string {
    return encodeURIComponent(nombre);
  }

  formatDuration(duration: string): string {
    const parts = duration.split(':');
    return parts.length === 3 && parts[0] === '00' ? `${parts[1]}:${parts[2]}` : duration;
  }
}