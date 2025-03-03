import { Component, OnInit, AfterViewInit } from '@angular/core';
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
  selector: 'app-podcaster',
  imports: [CommonModule, RouterModule],
  template: `
  
    @if (!artistNotFound) {
      <div class="bg-black pt-4 px-[34px] h-min-full">
      <div class="flex bg-opacity-60 p-4 rounded-[40px] items-end" [ngStyle]="{'background-color': dominantColor}">
        <img [src]="img_artiste" alt="Imagen del podcaster" id="artistImage" class="rounded-[20px] h-[200px] w-[200px]">
        <div class="pl-[14px]">
          <div class="flex items-center">
            <p class="text-white text-[14px]">{{ type }}</p>
            <img src="assets/certification.png" alt="Certificación" class="w-[14px] h-[14px] ml-2">
          </div>
          <h1 class="font-montserrat font-bold text-4xl ml-[-2px] text-white">{{ podcaster.nombre_podcaster }}</h1>
          <div class="flex items-center mt-2">
            <button (click)="follow()" class="bg-[var(--sponge)] border border-white rounded-full flex items-center px-4 py-1 mr-4">
              <img src="assets/plus.png" alt="Seguir" class="w-4 h-4 mr-2">
              <p class="font-montserrat font-bold text-sm text-white">Seguir</p>
            </button>
            <p class="text-white text-base max-sm:hidden">{{ podcaster.seguidores | number:'1.0-0':'es-ES' }} seguidores</p>
          </div>
        </div>
      </div>

      <div class="flex flex-row max-2xl:flex-col flex-wrap pt-[35px] w-full">
        <!-- Sección de las más reproducidas -->
        <div class="w-2/3 max-xl:w-full pr-20 max-xl:pr-0">
          <h2 class="font-montserrat font-bold text-2xl text-white mb-5">
              Actualizado Últimamente
          </h2>
          <div>
            
          </div>
        </div>

        <!-- Sección de "This is" -->
        <div class="w-1/3 max-xl:w-full flex flex-col justify-center">
          <h2 class="font-montserrat font-bold text-2xl text-white mb-5">
            Todas las episodios
          </h2>
          
          <button (click)="this_is()" class="flex flex-row items-end text-left">
            
            <div class="relative w-[288px] h-[288px] min-w-[288px] min-h-[288px]">
              <img [src]="img_artiste" alt="Imagen del podcaster" 
                  class="w-[288px] h-[288px] rounded-[40px] object-cover opacity-25">
              <img src="assets/heart.png" alt="Corazón" 
                  class="absolute top-[25%] left-[25%] w-40">
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
                <p class="font-montserrat font-bold text-sm text-white">Podcast</p>
            </button>
            <button (click)="setTab('cancion')" 
                class="bg-[var(--button)] rounded-full flex items-center px-4 py-1"
                [ngClass]="{'bg-[var(--buttonhover)]': selectedTab === 'cancion'}">
                <p class="font-montserrat font-bold text-sm text-white">Episodios</p>
            </button>
        </div>

        <!-- Vista de Álbumes (Fila larga con scroll horizontal) -->
        <div *ngIf="selectedTab === 'podcast'" 
            class="h-60 flex overflow-x-auto whitespace-nowrap scrollbar-hide space-x-4 pb-4">
            <div *ngFor="let podcast of this.podcaster.albumes" class="flex flex-col items-center flex-none w-44">
                <img [src]="podcast.link_imagen" [alt]="podcast.nombre_podcast" class="h-44 w-44 rounded-[40px] object-cover">
                <p class="text-white mt-2 font-bold">{{ podcast.nombre_podcast }}</p>
            </div>
        </div>

        <!-- Vista de Canciones (Fila larga con scroll horizontal) -->
        <div *ngIf="selectedTab === 'cancion'" 
            class="h-60 flex overflow-x-auto whitespace-nowrap scrollbar-hide space-x-4 pb-4">
            <div *ngFor="let episodio of this.podcaster.episodios" class="flex flex-col items-center flex-none w-44">
                <img [src]="episodio.link_imagen" [alt]="episodio.titulo" class="h-44 w-44 rounded-[40px] object-cover">
                <p class="text-white mt-2 font-montserrat font-bold">{{ episodio.titulo }}</p>
                <p class="text-white text-sm">{{ episodio.nombre_artista }}</p>
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
export class PodcasterComponent implements OnInit, AfterViewInit{
    podcaster: any = null;
    type: string = "Podcaster";
    img_artiste: string = "";
    artistNotFound: boolean = false; // Indicador de error
    nombre_artista = ''
    max_rep: any;
  
    constructor(
      private route: ActivatedRoute, 
      private authService: AuthService, 
      private titleService: Title,
      private router: Router,
      private playerService: PlayerService
    ) {}
  
    ngOnInit() {
      this.route.paramMap.subscribe(params => {
        const nombre_artista_encoded = this.route.snapshot.paramMap.get('nombre_artista') ?? '';
        this.nombre_artista = decodeURIComponent(nombre_artista_encoded);
        this.titleService.setTitle(`${this.nombre_artista} | Spongefy`);
  
        this.authService.getArtist(nombre_artista_encoded).subscribe({
            next: (data) => {
                if (data) {
                    this.podcaster = data;
                    // Aplicar transformaciones de Cloudinary dinámicamente
                    this.img_artiste = this.transformCloudinaryUrl(this.podcaster.link_imagen);
                    this.max_rep = this.podcaster.episodios
                        .sort((a: any, b: any) => b.n_repros - a.n_repros)
                        .slice(0, 5);
  
                    this.artistNotFound = false;
                } else {
                    this.artistNotFound = true;
                }
            },
            error: (err) => {
                console.error('Error al obtener el perfil del podcaster:', err);
                this.artistNotFound = true;
            },
        });
      }
    )}
  
    // Función para añadir transformaciones a la URL de Cloudinary
    transformCloudinaryUrl(url: string): string {
      if (!url.includes('cloudinary.com')) return url; // Asegurarse de que sea una URL de Cloudinary
      return url.replace('/upload/', '/upload/f_auto,fl_lossy,fl_any_format/');
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
        }
      });
    }
    
  
    this_is() {}
  
    selectedTab: 'podcast' | 'cancion' = 'podcast';
  
    setTab(tab: 'podcast' | 'cancion') {
      this.selectedTab = tab;
    }
  
    dominantColor: string = 'rgba(75, 85, 99, 4)'; // Color gris predeterminado con opacidad
  
    ngAfterViewInit() {
      const imgElement = document.getElementById('artistImage') as HTMLImageElement;
      if (imgElement) {
        imgElement.crossOrigin = 'anonymous'; // Importante para CORS
        if (imgElement.complete) {
            this.extractColor(imgElement);
        } else {
            imgElement.onload = () => {
                this.extractColor(imgElement);
            };
        }
      }
    }
  
    extractColor(imgElement: HTMLImageElement) {
      try {
        const colorThief = new ColorThief();
        if (imgElement && imgElement.src) {
            const result = colorThief.getColor(imgElement);
            this.dominantColor = `rgba(${result[0]}, ${result[1]}, ${result[2]}, 0.5)`;
            console.log('Dominant Color:', this.dominantColor);
        }
      } catch (error) {
        console.error('Error al extraer el color dominante:', error);
      }
    }
  
    getArtistasFeat(song: any): string[] {
      return song.artistas_feat ? song.artistas_feat.split(',').map((podcaster: string) => podcaster.trim()) : [];
    }
  
    encodeNombreArtista(nombre: string): string {
      return encodeURIComponent(nombre);
    }
  
    formatDuration(duration: string): string {
      const parts = duration.split(':');
      if (parts.length === 3 && parts[0] === '00') {
        return `${parts[1]}:${parts[2]}`;
      }
      return duration;
    }
}
