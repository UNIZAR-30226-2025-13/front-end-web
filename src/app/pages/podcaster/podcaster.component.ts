import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, Renderer2, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterModule, Router } from '@angular/router'
import localeEs from '@angular/common/locales/es';
import { PlayerService } from '../../services/player.service';
import { UsuarioService } from '../../services/usuario.service';
registerLocaleData(localeEs, 'es-ES');


// @ts-ignore
import ColorThief from 'colorthief';
import { QueueService } from '../../services/queue.service';

@Component({
  selector: 'app-podcaster',
  imports: [CommonModule, RouterModule],
  template: `
  
    @if (!podcasterNotFound) {
    <div #container class="bg-black pt-4 px-[34px] h-min-full w-full">
      <div class="flex bg-opacity-60 p-4 rounded-[40px] items-end" [ngStyle]="{'background-color': dominantColor}">
        <img [src]="img_artiste" alt="Imagen del podcaster" id="artistImage" class="rounded-[20px] h-[200px] w-[200px] object-cover"
        [ngClass]="{'hidden': this.anchoReal < 650, 'block': !(this.anchoReal < 650)}">
        <div class="pl-[14px]">
          <div class="flex items-center">
            <p class="text-white text-[14px]">{{ type }}</p>
            <img src="assets/certification.png" alt="Certificación" class="w-[14px] h-[14px] ml-2">
          </div>
          <h1 class="font-montserrat font-bold text-4xl ml-[-2px] text-white">{{ podcaster.nombre_podcaster }}</h1>
          <div class="flex items-center mt-2">
            <button (click)="follow()" 
                    class="bg-[var(--sponge)] border border-white rounded-full flex items-center px-4 py-1 mr-4 w-30">
              <img [src]="isFollowing ? 'assets/heart.png' : 'assets/plus.png'" 
                  alt="Seguir" 
                  class="w-4 h-4 mr-2 transition-transform duration-300" 
                  [ngClass]="{'rotate-0': isFollowing, 'rotate-[-90deg]': !isFollowing}">
              <p class="font-montserrat font-bold text-sm text-white">
                {{ isFollowing ? 'Seguido' : 'Seguir' }}
              </p>
            </button>
            <p class="text-white text-base">{{ this.seguidores | number:'1.0-0':'es-ES' }} seguidores</p>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap pt-[35px] w-full" [ngClass]="{'flex-col': this.anchoReal < 1400, 'flex-row': !(this.anchoReal < 1400)}">
        

        <!-- Sección de las más reproducidas -->
        <div class="w-2/3 max-xl:w-full pr-20 max-xl:pr-0 pb-4">
          <h2 class="font-montserrat font-bold text-2xl text-white mb-5">
              Actualizado Últimamente
          </h2>
          <div class="flex flex-row">
            <div >
              <img class="min-w-80 h-80 rounded-[40px]" [src]="this.ep_mas_reciente[0].link_imagen">
            </div>          
            <div class="flex flex-col text-white pl-5 gap-4 w-140">
              <p class="text-5xl font-extrabold line-clamp-2">{{this.ep_mas_reciente[0].nombre}}</p>
              <p class="text-2xl font-bold line-clamp-1"> Último episodio </p>
              <p class="text-2xl font-semibold line-clamp-2"> {{this.ep_mas_reciente[0].titulo_episodio}} </p>
              <p class="text-sm line-clamp-4"> {{this.ep_mas_reciente[0].descripcion}} </p>
            </div>          
          </div>
        </div>

        <!-- Sección de "This is" -->
        <div class="flex flex-col"
        [ngClass]="{'w-full': this.anchoReal < 1400, 'w-2/5': !(this.anchoReal < 1400)}">
          <h2 class="font-montserrat font-bold text-2xl text-white mb-5">
            Todas las episodios
          </h2>
          
          <button class="flex flex-row items-end text-left cursor-pointer group" [routerLink]="['/inicio/lista_reproduccion/', (podcaster.lista_this_is.id_lista)]">
            
            <div class="relative w-[288px] h-[288px] min-w-[288px] min-h-[288px]">
              <img [src]="img_artiste" alt="Imagen del podcaster" 
                  class="w-[288px] h-[288px] rounded-[40px] object-cover opacity-25">
              <img src="assets/heart.png" alt="Corazón" 
                  class="absolute top-[25%] left-[25%] w-40 transition-transform duration-300 group-hover:scale-120">
            </div>
            
            <h2 class="max-sm:hidden font-montserrat font-bold text-6xl text-white ml-[18px] w-80">
              This is {{ podcaster.nombre_podcaster }}
            </h2>        
          </button>
        </div>
      </div>

      <div class="mt-[20px] pb-10">
        <h2 class="font-montserrat font-bold text-2xl text-white mb-5">Lanzamientos</h2>
        <!-- Botones de Tab -->
        <div class="flex mb-5">
            <button (click)="setTab('podcast')" 
                class="bg-[var(--button)] rounded-full flex items-center px-4 py-1 mr-4"
                [ngClass]="{'bg-[var(--buttonhover)]': selectedTab === 'podcast'}">
                <p class="font-montserrat font-bold text-sm text-white">Podcasts</p>
            </button>
            <button (click)="setTab('episodios')" 
                class="bg-[var(--button)] rounded-full flex items-center px-4 py-1"
                [ngClass]="{'bg-[var(--buttonhover)]': selectedTab === 'episodios'}">
                <p class="font-montserrat font-bold text-sm text-white">Episodios</p>
            </button>
        </div>

        <!-- Vista de Álbumes (Fila larga con scroll horizontal) -->
        <div *ngIf="selectedTab === 'podcast'" 
            class="h-60 flex overflow-x-auto whitespace-nowrap scrollbar-hide space-x-4 pb-4">
            <div *ngFor="let podcast of this.podcaster.podcasts_info" class="flex flex-col items-center cursor-pointer flex-none max-w-44 transition-transform duration-300 hover:scale-97">
                <img [src]="podcast.link_imagen" [alt]="podcast.nombre" class="h-44 w-44 rounded-[40px] object-cover">
                <p class="text-white mt-2 font-bold line-clamp-2 max-w-44">{{ podcast.nombre }}</p>
            </div>
        </div>

        <!-- Vista de Canciones (Fila larga con scroll horizontal) -->
        <div *ngIf="selectedTab === 'episodios'" 
        class="h-60 flex overflow-x-auto whitespace-nowrap scrollbar-hide space-x-4 pb-4">
        
          <div *ngFor="let episodios of this.podcaster.list_episodios" 
              class="group flex flex-col items-center flex-none max-w-44 cursor-pointer transition-transform duration-300 hover:scale-97">
              
              <!-- Contenedor de la imagen con relative -->
              <div class="relative">
                  <!-- Imagen de la canción -->
                  <img [src]="episodios.link_imagen" 
                      [alt]="episodios.titulo_episodio" 
                      class="h-44 w-44 rounded-[40px] object-cover">
                  
                  <!-- Ícono de Play dentro de la imagen, abajo a la derecha -->
                  <img src="assets/play.png" 
                      alt="Play" 
                      class="hover:block none absolute bottom-4 right-4 h-11 w-11 bg-[var(--sponge)] p-1 rounded-full 
                      opacity-0 transform rotate-[-45deg] group-hover:opacity-100 group-hover:rotate-0
                      transition-all duration-300"
                      (click)="addSongToQueue(episodios)">
              </div>

              <!-- Información de la canción -->
              <p class="text-white mt-2 font-montserrat font-bold line-clamp-2 max-w-44 h-auto">
                  {{ episodios.titulo_episodio }}
              </p>
              <p class="text-white text-sm line-clamp-2 max-w-44">
                  {{ episodios.nombre }}
              </p>
          </div>
        </div>
      </div>
      </div>
    } @else {
      <div class="bg-black pt-4 px-[34px] h-full">
        <div class="text-center py-20">
          <p class="text-white text-3xl font-bold">No se ha podido encontrar a {{ this.nombre_podcaster}}.</p>
          <p class="text-white text-lg mt-4">Intenta buscar otro nombre o revisa la conexión.</p>
        </div>
      </div>
    } 
  `,
  styles: ``
})
export class PodcasterComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('container', { static: false }) container!: ElementRef;

  podcaster: any = null;
  ep_mas_reciente: any = null;
  type: string = 'Podcaster';
  img_artiste: string = '';
  podcasterNotFound: boolean = false;
  nombre_podcaster = '';
  max_rep: any;
  dominantColor: string = 'rgba(75, 85, 99, 0.5)'; // Color gris predeterminado
  selectedTab: 'podcast' | 'episodios' = 'podcast';
  anchoReal: number = 0;
  isFollowing: boolean = false;
  seguidores: number = 0;
  private resizeObserver!: ResizeObserver;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private titleService: Title,
    private router: Router,
    private playerService: PlayerService,
    private renderer: Renderer2,
    private ngZone: NgZone,
    private queueService: QueueService,
    private userService: UsuarioService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const nombre_podcaster_encoded = this.route.snapshot.paramMap.get('nombre_podcaster') ?? '';
      this.nombre_podcaster = decodeURIComponent(nombre_podcaster_encoded);
      this.titleService.setTitle(`${this.nombre_podcaster} | Spongefy`);

      this.authService.getPodcaster(nombre_podcaster_encoded).subscribe({
        next: (data) => {
          if (data) {
            this.podcaster = data;
            this.ep_mas_reciente = data.ep_mas_reciente;
            this.img_artiste = this.transformCloudinaryUrl(this.podcaster.link_imagen);
            this.seguidores = data.seguidores;
            console.log('Nombre de usuario:', this.userService.getUsuario()?.nombre_usuario);
            console.log('Nombre del podcaster:', nombre_podcaster_encoded);
            this.authService.isFollowerCreator(this.userService.getUsuario()?.nombre_usuario, this.nombre_podcaster).subscribe({
              next: (response) => {
                
                console.log('Respuesta de isFollowerCreator:', response);
                this.isFollowing = response.es_seguidor;
                
              }
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

            this.podcasterNotFound = false;
          } else {
            this.podcasterNotFound = true;
          }
        },
        error: (err) => {
          console.error('Error al obtener el perfil del podcaster:', err);
          this.podcasterNotFound = true;
        },
      });
    });
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

  ngOnDestroy() {
    this.resizeObserver.disconnect();
  }

  extractColor(imgElement: HTMLImageElement) {
    try {
        const colorThief = new ColorThief();

        if (imgElement.naturalWidth > 0) {
            const palette = colorThief.getPalette(imgElement, 10); // Extrae hasta 10 colores
            
            if (!palette || palette.length === 0) {
                console.error("No se pudo extraer la paleta de colores.");
                return;
            }

            let bestColor = null;
            let maxSaturation = -1;

            for (const color of palette) {
                const [r, g, b] = color;
                const { h, s, l } = this.rgbToHsl(r, g, b);

                // Filtrar solo colores grises y blancos, pero mantener oscuros
                if (s > maxSaturation && s > 0.2) {
                    maxSaturation = s;
                    bestColor = color;
                }
            }

            if (bestColor) {
                this.dominantColor = `rgba(${bestColor[0]}, ${bestColor[1]}, ${bestColor[2]}, 0.5)`;
            } else {
                this.dominantColor = "rgba(255, 255, 255, 0.5)"; // Blanco como fallback
            }
        }
    } catch (error) {
        console.error("Error al extraer el color más saturado y brillante:", error);
    }
}

// 🔹 Función para convertir RGB a HSL
 rgbToHsl(r: number, g: number, b: number) {
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { h, s, l };
}

  transformCloudinaryUrl(url: string): string {
    return url.includes('cloudinary.com') ? url.replace('/upload/', '/upload/f_auto,fl_lossy,fl_any_format/') : url;
  }


  follow() {
    if (!this.isFollowing) {
      this.authService.followCreator(this.userService.getUsuario()?.nombre_usuario, this.podcaster.nombre_podcaster).subscribe({
        next: () => {
          console.log('Seguido correctamente');
          this.isFollowing = !this.isFollowing;
          this.seguidores += this.isFollowing ? 1 : -1;
        },
        error: (err) => {
          console.error('Error al seguir al artista:', err);
        }
      });
    } else {
      this.authService.unfollowCreator(this.userService.getUsuario()?.nombre_usuario, this.podcaster.nombre_podcaster).subscribe({
        next: () => {
          console.log('Dejado de seguir correctamente');
          this.isFollowing = !this.isFollowing;
          this.seguidores += this.isFollowing ? 1 : -1;
        },
        error: (err) => { 
          console.error('Error al dejar de seguir al artista:', err);
        }
      });
    }
  }


  playSong(song: any) {
    this.authService.playSong(song.id_episodio).subscribe({
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

  addSongToQueue(selectedSong: any) {
    const usuario = this.userService.getUsuario()?.nombre_usuario;
    console.log('Cancion seleccionada:', selectedSong);
    this.queueService.clearQueue(this.userService.getUsuario()?.nombre_usuario).subscribe(() => {
    });
    
    if (!usuario || !selectedSong) return;
  
    // Añadir solo la canción seleccionada a la cola
    this.queueService.addToQueue(usuario, selectedSong.id_episodio).subscribe({
      next: () => {
        // Cargar la canción seleccionada inmediatamente
        this.playerService.loadSongByPosition(0);
        this.playerService.getQueue(usuario);
        console.log('Canción añadida a la cola.');
      },
      error: (err: any) => {
        console.error('Error al añadir la canción a la cola:', err);
      },
    });
  }

  this_is() {}

  setTab(tab: 'podcast' | 'episodios') {
    this.selectedTab = tab;
  }

  encodeNombreArtista(nombre: string): string {
    return encodeURIComponent(nombre);
  }

  formatDuration(duration: string): string {
    const parts = duration.split(':');
    return parts.length === 3 && parts[0] === '00' ? `${parts[1]}:${parts[2]}` : duration;
  }
}