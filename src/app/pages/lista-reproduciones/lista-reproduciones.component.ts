import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
 
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
 
import { Title } from '@angular/platform-browser';
 
import { AuthService } from '../../services/auth.service';
 
import { CommonModule } from '@angular/common';
 
import { PlayerService } from '../../services/player.service';
<<<<<< Maryne
import { FormsModule } from '@angular/forms';


import { FormsModule } from '@angular/forms';
 

 
// @ts-ignore
 
import ColorThief from 'colorthief';
 

 
@Component({
 
  selector: 'app-lista-reproduciones',
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
 
  <div class="bg-black pt-4 px-[34px] min-h-full">
 
    <!-- upper box -->
 
    <div class="flex p-4 rounded-[40px] items-end"
 
     [ngStyle]="{'background-color': getTransparentColor(this.color_playlist, 0.5)}">
 
    
 
      <div class="flex-col items-center justify-center">
 
        <div class="flex flex-row items-center justify-center space-x-4">
 
              
 
          <!-- Caso: "This is..." -->
 
          <div *ngIf="isThisIsPlaylist(); else checkFavorites" class="flex flex-row gap-5">
 
            <div class="rounded-[20px] h-[200px] w-[200px] flex flex-none items-end justify-start overflow-hidden">
 
              <div class="group relative w-[200px] h-[200px] min-w-[200px] min-h-[200px]">
 
                <img [src]="img_artiste" id="artistImage" alt="Imagen del artista" 
 
                    class="w-[200px] h-[200px] rounded-[20px] object-cover">
 
                <img src="assets/heart.png" alt="Corazón" 
 
                    class="absolute top-[22%] left-[22%] w-30">
 
              </div>
 
            </div>
 
              
 
            <!-- Información normal de la playlist -->
 
            <div class="flex flex-col items-start justify-end mb-1">
 
                <p class="text-white">Lista de reproducción</p>
 
                <h1 class="font-montserrat font-bold text-4xl ml-[-2px] text-white">{{ name }}</h1>
 
                <div class="flex flex-row text-white">
 
                  <span class="hover:underline cursor-pointer" [routerLink]="['/inicio/artista/', encodeNombreArtista(getArtistFromThisIs() ?? '')]">{{getArtistFromThisIs()}}</span>&nbsp;<span>| {{ numberSong }} {{ numberSong === 1 ? 'canción' : 'canciones' }} | {{ durationTotal }}</span>
 
                </div>
 
            </div>
 
          </div>
 

 
          <!-- Caso: "Tus canciones favoritas" o "Tus episodios favoritos" -->
 
          <ng-template #checkFavorites>
 
              <div *ngIf="isFavoritesPlaylist(); else normalPlaylist" 
 
                    class="flex flex-row gap-5">
 
                    <div class="rounded-[20px] h-[200px] w-[200px] flex flex-none items-end justify-start overflow-hidden">
 
                <div class="group relative w-[200px] h-[200px] min-w-[200px] min-h-[200px]">
 
                <div class="rounded-[20px] h-[200px] w-[200px] flex flex-none items-end justify-start overflow-hidden"
 
                    [ngStyle]="{'background-color': color_playlist}">
 
              </div>
 
                      class="w-[200px] h-[200px] rounded-[20px] object-cover">
 
                  <img src="assets/heart.png" alt="Corazón" 
 
                      class="absolute top-[22%] left-[22%] w-30">
 
              </div>
 
            </div>
 
              
 
            <!-- Información normal de la playlist -->
 
            <div class="flex flex-col items-start justify-end mb-1">
 
                <p class="text-white">Lista de reproducción</p>
 
                <h1 class="font-montserrat font-bold text-4xl ml-[-2px] text-white">{{ name }}</h1>
 
                <p class="text-white">{{ numberSong }} {{ numberSong === 1 ? 'canción' : 'canciones' }} | {{ durationTotal }}</p>
 
            </div>
 
              </div>
 
          </ng-template>
 

 
          <!-- Caso Normal -->
 
          <ng-template #normalPlaylist>
 
            <div class="flex flex-row gap-5">  
 
              <div class="rounded-[20px] h-[200px] w-[200px] flex flex-none items-end justify-start overflow-hidden"
 
                    [ngStyle]="{'background-color': color_playlist}">
 
                  <p class="text-black font-extrabold text-left text-[34px] mb-5 ml-[-2px] leading-none"
 
                      style="word-break: break-word; white-space: normal;">
 
                      {{ name }}
 
                  </p>
 
              </div>
 
              
 
              <!-- Información normal de la playlist -->
 
              <div class="flex flex-col items-start justify-end mb-1">
 
                  <p class="text-white">Lista de reproducción</p>
 
                  <h1 class="font-montserrat font-bold text-4xl ml-[-2px] text-white">{{ name }}</h1>
 
                  <p class="text-white">{{ visibility === 'publica' ? 'Pública' : 'Privada' }} | {{ numberSong }} {{ numberSong === 1 ? 'canción' : 'canciones' }} | {{ durationTotal }}</p>
 
              </div>
 
            </div>
 
          </ng-template>
 
        </div>
 
        <div class=" flex mt-4 gap-1">
 
          <img src="assets/play.png" alt="play" (click)="playSong(canciones[0])" class=" h-[52px] w-[52px]">
 
          <img src="assets/aleatorio.png" alt="aleatorio" (click)="random()" class=" h-[52px] w-[52px]">
 
          <img src="assets/anyadirplaylist.png" alt="anadir" (click)="add()" class=" h-[52px] w-[52px]">
 
          <p (click)="option()" class="font-montserrat font-bold text-4xl text-white h-[58px] w-[31px]">...</p> 
 
        </div>
 
      </div>
 
    </div>
 

 
    <!-- upper box -->
 

    <div class="flex justify-between">
 

      <div class="flex items-center gap-2 m-4 p-2 rounded-full hover:bg-neutral-700 hover:border-neutral-600 focus-within:border-neutral-500 focus-within:bg-neutral-600 transition-colors w-fit">
 

      <img src="assets/search.png" class="h-[40px] w-[40px]" (click)="search()">
 

      <input [(ngModel)]="searchQuery" (input)="search()" class="font-montserrat text-white text-lg bg-transparent outline-none placeholder-gray-400 rounded-md px-2 min-w-[100px] w-full flex-1" placeholder="Buscar">
 

      </div>
 
        <div class="flex font-montserrat text-white text-lg m-4 items-center">
 

        <img src="assets/sort.png" class="h-[22px] w-[22px]">
 

        <select (change)="sortSongs($event)" class="bg-black border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-white focus:border-white block w-full p-2.5 dark:bg-black dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-black dark:focus:border-black rounded-md p-1">
 
          <option value="Fecha_publicación" selected> Fecha de publicación</option>
 
          <option value="reproduciones">Número de reproduciones</option>
 
          <option value="titulo">Titulo </option>

          <option value="artista">Artista </option>

          <option value="duracion">Duracion </option>

         <!-- 
          <option value="album">Album </option>
          <option value="valoracion">Tu Valoracion </option>

        -->

          
 

        </select>
        <div class="flex items-center gap-2 m-4 ml-0 p-2 rounded-full hover:bg-neutral-700 hover:border-neutral-600 focus-within:border-neutral-500 focus-within:bg-neutral-600 transition-colors w-fit">
          
        <ng-container *ngIf="order === true; else order_change"> 
 
          <img src="assets/up_arrow.png" alt="up_arrow" class="w-5 h-auto " (click)="revert()"/>

        </ng-container>

        <ng-template #order_change>

        <img src="assets/down_arrow.png" alt="down_arrow" class="w-5 h-auto" (click)="revert()"/>

      </ng-template>

 

 
       
 
        </div>
        </div>
</div>
 
    <div class="m-4">       
 
    <!-- song list -->
 
        <div class="grid grid-cols-20 gap-4 text-left text-white">



            <div class="font-bold col-span-6 ">Título</div>

            <div class="font-bold col-span-4 ">Álbum</div>

            <div class="font-bold col-span-4">Tu valoración</div>

            <div class="font-bold col-span-4">Fecha en la que se publicó</div>

            <div class="font-bold col-span-1">Duracion</div>

        </div>
 
    <hr class="border-t-2 border-white my-4 ">  
 
        <div *ngFor="let song of canciones" class="grid grid-cols-20 gap-4 text-white items-center hover:bg-gray-500/20 rounded-[10px] transition-transform duration-300 hover:scale-101" (dblclick)="playSong(song)">
 
            <div class="flex m-2 col-span-6 ">
 
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
 
                <div class="flex flex-col min-w-0">
 
                    <p class="font-montserrat font-bold text-lg text-white">
 
                        {{ song.titulo  }}
 
                    </p>
 
                    <div class="flex flex-row">
 
                      <p  class="text-white text-sm hover:underline" [routerLink]="['/inicio/artista/', encodeNombreArtista(song.nombre_artista)]">
 
                          {{ song.nombre_artista }}
 
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
 
            <div class="col-span-4"> {{song.album}}</div>
 
            <div class="col-span-4 flex"  >
 
            <ng-container *ngIf="song.valoration_media === 0; else rated_media"> 
 
                <img src="assets/star_no_rate.png" alt="star" class="w-5 h-auto flex-col" />
 
              </ng-container>
 
            <ng-template #rated_media>
 
            <img *ngFor="let star of generateStars(song.valoration_media)" src="assets/star.png" alt="star" class="w-5 h-auto flex-col"/>
 
            <script src="script.js"></script>
 
              </ng-template>
 
              
 
            </div> 
 
            <div class="col-span-4">{{ formatFecha(song.fecha_pub) }}</div> 
 
            <div class="col-span-1">{{ formatDurationSong(song.duracion) }}</div>
 
            <div class=" flex items-center space-x-3   col-span-1 mr-5">
 
                <img src="assets/anyadirplaylist.png" alt="anadir" (click)="add()" class=" h-[17px] w-[18px]">
 
                <img src="assets/heart.png" alt="like" (click)="like()" class=" h-[17px] w-[18px]">
 
                <p (click)="option()" class="font-montserrat font-bold text-xl text-white pb-3 ">...</p> 
 
        
 
            </div>
 
        
 
        </div>
 
        <hr class="border-t-2 border-white my-4">
 
    </div>  
 

 
`,
 
})
 
export class ListaReproducionesComponent implements OnInit {
 
  id_playlist: string = '';
 
  playlist: any = null;
 
  name: string = '';
 
  color_playlist: string = '';

  canciones_playlist: any[] = [];
  canciones:any[] = [];
  playlistNotFound = false;
 
  durationTotal: string = '';
 
  numberSong:number = 0;
  visibility: string = 'publica';
  img_artiste: string = '';
  searchQuery: string = '';
  filteredSongs : any= null;

  order = true;
 

 
  constructor(
 
    private route: ActivatedRoute,
 
    private titleService: Title,
 
    private authService: AuthService,
 
    private router: Router,
 
    private playerService: PlayerService,
 
    private cdRef: ChangeDetectorRef
 
  ) {}
 

 
  ngOnInit() {
 
    this.route.paramMap.subscribe(params => {
 
      this.id_playlist = params.get('id_playlist') ?? '';
 
      if (this.id_playlist) {
 
        this.getPlaylistData(this.id_playlist);
 
      }
 
    });
 
  }
 

 
  getPlaylistData(id_playlist: string) {
 
    this.authService.getPlaylistData(id_playlist).subscribe({
 
      next: (data) => {
 
        console.log('Données reçues:', data);
 
        if (data) {
 
          this.playlist = data;
 
          this.name = data.nombre;

          this.canciones_playlist = data.canciones || [];          
          this.canciones = data.canciones || [];
          this.titleService.setTitle(`${data.nombre} | Spongefy`);
          this.durationTotal = this.calculateDurationTotal(this.canciones_playlist);
          this.playlistNotFound = false;
          this.numberSong = this.canciones_playlist.length;
          console.log('chansons_un:', this.canciones_playlist);
          if (this.isThisIsPlaylist()) {
 
            this.handleThisIsPlaylist();
 
          } else {
 
            this.color_playlist = data.color;
 
          } 

          this.canciones = this.canciones_playlist;
 

          console.log('chansons:', this.canciones);
 

 
        } else {
 
          this.playlistNotFound = true;
 
        }
 
      },
 
      error: (err) => {
 
        console.error('Erreur lors de la récupération de la playlist:', err);
 
        this.playlistNotFound = true;
 
      }
 
    });
 
  }
 

 

  calculateDurationTotal(canciones_playlist: any[]): string {

    let totalSeconds = 0;
 

 

    canciones_playlist.forEach((cancion) => {
 
        console.log('Durée de la chanson:', cancion.duracion);
 

 
        if (typeof cancion.duracion === 'string' && cancion.duracion.includes(':')) {
 
            const parts = cancion.duracion.split(':').map(Number);
 

 
            if (parts.length === 3) {
 
                const [hours, minutes, seconds] = parts;
 
                if (!isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {
 
                    totalSeconds += hours * 3600 + minutes * 60 + seconds;
 
                } else {
 
                    console.warn('Valeur non numérique détectée dans la durée:', parts);
 
                }
 
            } else {
 
                console.warn('Format de durée incorrect:', cancion.duracion);
 
            }
 
        } else {
 
            console.warn('Durée invalide ou manquante:', cancion.duracion);
 
        }
 
    });
 

 
    console.log('Durée totale en secondes:', totalSeconds);
 
    return this.formatDuration(totalSeconds);
 
}
 

 
formatDuration(totalSeconds: number): string {
 
    console.log('Formatage de:', totalSeconds);
 
    const hours = Math.floor(totalSeconds / 3600);
 
    totalSeconds %= 3600;
 
    const minutes = Math.floor(totalSeconds / 60);
 
    const seconds = totalSeconds % 60;
 

 
    let formatted = '';
 
    if (hours > 0) {
 
        formatted += `${hours} h `;
 
    }
 
    if (minutes > 0) {
 
        formatted += `${minutes} mins `;
 
    }
 
    if (seconds > 0 || formatted === '') {
 
        formatted += `${seconds} s`;
 
    }
 

 
    console.log('Durée formatée:', formatted.trim());
 
    return formatted.trim();
 
}
 

 

 
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
 

 
  getArtistasFeat(song: any): string[] {
 
    return song.artistas_feat ? song.artistas_feat.split(',').map((artista: string) => artista.trim()) : [];
 
  }
 

 
  encodeNombreArtista(nombre: string): string {
 
    return encodeURIComponent(nombre);
 
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
 

 
  random(){}//TODO
 
  add(){}//TODO
 
  option(){}//TODO
 
  like(){}//TODO
 

 
  generateStars(valoration: number): number[] {
 
    return new Array(valoration).fill(0); 
 
  }
 

 
  getTransparentColor(hex: string, alpha: number): string {
 
    if (!hex) return 'rgba(0, 0, 0, 0.5)'; // Color de respaldo
 

 
    hex = hex.replace(/^#/, '');
 

 
    let r = parseInt(hex.substring(0, 2), 16);
 
    let g = parseInt(hex.substring(2, 4), 16);
 
    let b = parseInt(hex.substring(4, 6), 16);
 

 
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
 
  }
 

 
  isThisIsPlaylist(): boolean {
 
    return this.name.toLowerCase().startsWith("this is");
 
  }
 

 
  isFavoritesPlaylist(): boolean {
 
    return this.name.toLowerCase() === "tus canciones favoritas" || 
 
           this.name.toLowerCase() === "tus episodios favoritos";
 
  }
 

 
  getArtistFromThisIs(): string | null {
 
    if (this.isThisIsPlaylist()) {
 
      return this.name.replace(/^This is\s+/i, '').trim(); // Elimina "This is " del inicio
 
    }
 
    return null;
 
  }
 

 
  handleThisIsPlaylist() {
 
    console.log("🎵 Aplicando configuraciones especiales para 'This is...'");
 

 
    const nombre_artista = this.getArtistFromThisIs();
 
    if (!nombre_artista) return;
 

 
    const nombre_artista_encoded = encodeURIComponent(nombre_artista);
 

 
    this.authService.getArtist(nombre_artista_encoded).subscribe({
 
      next: (data) => {
 
        if (data) {
 
          this.img_artiste = this.transformCloudinaryUrl(data.link_imagen);
 
          setTimeout(() => {
 
            const imgElement = document.getElementById('artistImage') as HTMLImageElement;
 

 
            if (imgElement) {
 
              imgElement.crossOrigin = "anonymous"; // 🚀 Aseguramos que la imagen se cargue con CORS
 
              imgElement.src = this.img_artiste; // 👈 Esto debe ir después de asignar `crossOrigin`
 

 
              imgElement.onload = () => {
 
                if (imgElement.naturalWidth > 0) {
 
                  console.log("✅ Imagen cargada después del timeout, extrayendo colores...");
 
                  this.extractColor(imgElement);
 
                } else {
 
                  console.warn("⚠️ Imagen sigue sin estar cargada después del timeout.");
 
                }
 
              };
 

 
              imgElement.onerror = () => {
 
                console.error("❌ Error al cargar la imagen. Puede ser problema de CORS.");
 
              };
 
            }
 
          }, 100);
 
        }
 
      },
 
      error: (err) => {
 
        console.error('Error al obtener el perfil del artista:', err);
 
      },
 
    });
 
  }
 

 
  transformCloudinaryUrl(url: string): string {
 
    return url.includes('cloudinary.com') ? url.replace('/upload/', '/upload/f_auto,fl_lossy,fl_any_format/') : url;
 
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
 
                this.color_playlist = this.rgbToHex(bestColor[0], bestColor[1], bestColor[2]);
 
                console.log(this.color_playlist);
 
            } else {
 
                this.color_playlist = "#FFFFFF"; // Blanco como fallback
 
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
 

 
  rgbToHex(r: number, g: number, b: number): string {
 
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
 
}
 

sortSongs(event: Event) {
 

  const selectElement = event.target as HTMLSelectElement;
 

  const selectedValue = selectElement.value;
 

  console.log('Valeur sélectionnée:', selectedValue);
 
  this.order = true;
  switch (selectedValue) {
 

      case 'Fecha_publicación':
          this.canciones.sort((a, b) => new Date(b.fecha_pub).getTime() - new Date(a.fecha_pub).getTime());
          break;
 

      case 'reproduciones':
          this.canciones.sort((a, b) => b.n_repros - a.n_repros);
          break;
 

      case 'titulo':
          this.canciones.sort((a, b) => a.titulo.localeCompare(b.titulo));
          break;

      case 'artista':
        this.canciones.sort((a, b) => a.autor.localeCompare(b.autor));
        break;
      
      case 'duracion':
        this.canciones.sort((a, b) => a.duracion.localeCompare(b.duracion));
        break;

      //case 'album':
        //this.canciones.sort((a, b) => a.album.localeCompare(b.album));
        //break;
      
      //case 'valoracion':
        //this.canciones.sort((a, b) => b.valoracion - a.valoracion);
        //break;

   
 

  }
 

 sortSongs(event: Event) {
  const selectElement = event.target as HTMLSelectElement;
  const selectedValue = selectElement.value;
  console.log('Valeur sélectionnée:', selectedValue);
  switch (selectedValue) {
      case 'Fecha_publicación':
          this.canciones.sort((a, b) => new Date(b.fecha_pub).getTime() - new Date(a.fecha_pub).getTime());
          break;
      case 'reproduciones':
          this.canciones.sort((a, b) => b.n_repros - a.n_repros);
          break;
      case 'titulo':
          this.canciones.sort((a, b) => a.titulo.localeCompare(b.titulo));
          break;
  }
}

search() {
  if (!this.searchQuery || this.searchQuery.trim() === ''){
    this.canciones = this.canciones_playlist
  }
  else{
  this.canciones = this.canciones_playlist.filter(song =>
    song.titulo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
    song.nombre_artista.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
    song.artistas_feat.toLowerCase().includes(this.searchQuery.toLowerCase())

    //TODO add album
  
  );
}
}

 

 

search() {
 

  if (!this.searchQuery || this.searchQuery.trim() === ''){
 

    this.canciones = this.canciones_playlist
 

  }
 

  else{
 


  this.canciones = this.canciones_playlist.filter(song =>
 
    song.titulo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
    
    song.nombre_artista.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
 
    song.artistas_feat.toLowerCase().includes(this.searchQuery.toLowerCase())
 
    //TODO add album
  );
}
 }

revert(){
  this.canciones.reverse();
  this.order = !this.order;
}
 

}
 
