import { Component, OnInit, ChangeDetectorRef, Renderer2, ViewChild, NgZone, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; 
import { Title } from '@angular/platform-browser'; 
import { AuthService } from '../../services/auth.service'; 
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../services/player.service';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { QueueService } from '../../services/queue.service';
import { concatMap, concatWith, forkJoin, from, of, tap } from 'rxjs';

// @ts-ignore
import ColorThief from 'colorthief';

interface PlaylistChoice {
  name: string;
  id?: number;
  selected: boolean;
}

interface Playlist {
  nombre: string;
  id_lista: number;

}

@Component({
 
  selector: 'app-lista-reproduciones',
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
 
  <div #container class="bg-black pt-4 px-[34px] min-h-full">
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
 
            <!-- Información normal de la list -->
            <div class="flex flex-col items-start justify-end mb-1">
                <p class="text-white">Lista de reproducción</p>
                <h1 class="font-montserrat font-bold text-4xl ml-[-2px] text-white">{{ name }}</h1>
                <div class="flex flex-row text-white">
                  <span class="hover:underline cursor-pointer" [routerLink]="['/inicio/artista/', encodeNombreArtista(getArtistFromThisIs() ?? '')]">{{getArtistFromThisIs()}}</span>&nbsp;<span>| {{ numberCm }} {{list.es_playlist? (numberCm === 1 ? 'canción' : 'canciones') : (numberCm === 1 ? 'episodio' : 'episodios') }} | {{ durationTotal }}</span>
                </div>
            </div>
          </div>
  
          <!-- Caso: "Tus contenido favoritas" o "Tus episodios favoritos" -->
           <ng-template #checkFavorites>
              <div *ngIf="isFavoritesPlaylist(); else normalPlaylist" 
                    class="flex flex-row gap-5">
                <div class="rounded-[20px] h-[200px] w-[200px] flex flex-none items-end justify-start overflow-hidden">
                  <div class="group relative w-[200px] h-[200px] min-w-[200px] min-h-[200px]">
                    <div class="rounded-[20px] h-[200px] w-[200px] flex flex-none items-end justify-start overflow-hidden"
                      [ngStyle]="{'background-color': color_playlist}">
        
                    </div> 
                    <img src="assets/heart.png" alt="Corazón" 
                      class="absolute top-[22%] left-[22%] w-30">
                  </div>
                </div>
  
                <!-- Información normal de la list -->
                <div class="flex flex-col items-start justify-end mb-1">
                  <p class="text-white">Lista de reproducción</p>
                  <h1 class="font-montserrat font-bold text-4xl ml-[-2px] text-white">{{ name }}</h1>
                  <p class="text-white">{{ numberCm }} {{list.es_playlist ? (numberCm === 1 ? 'canción' : 'canciones') : (numberCm === 1 ? 'episodio' : 'episodios') }} | {{ durationTotal }}</p>
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
     
          <!-- Información normal de la list -->
              <div class="flex flex-col items-start justify-end mb-1 text-white">
                  <p class="">Lista de reproducción</p>
                  <h1 class="font-montserrat font-bold text-4xl ml-[-2px]">{{ name }}</h1>
                  <div class="flex flex-row">
                  <span>{{ visibility ? 'Pública' : 'Privada' }} | {{ numberCm }} {{list.es_playlist? (numberCm === 1 ? 'canción' : 'canciones') : (numberCm === 1 ? 'episodio' : 'episodios') }} | {{ durationTotal }} |&nbsp;</span><span class="hover:underline cursor-pointer" [routerLink]="['/inicio/usuario/', this.list.nombre_usuario]">{{this.list.nombre_usuario}}</span>
                  </div>
              </div>
            </div>
          </ng-template>
        </div>
 
        <div class=" flex mt-4 gap-1.5">
          <img src="assets/play.png" alt="play" (click)="addSongsToQueue(contenido[0])" class=" h-[52px] w-[52px]">
          <img src="assets/aleatorio.png" alt="aleatorio" (click)="random()" class=" h-[52px] w-[52px]">
          
           @if (this.list.nombre_usuario === this.userService.getUsuario()?.nombre_usuario && !this.isFavoritesPlaylist()) {
          <!-- Contenedor de los "..." con menú -->
          <div class="relative">
            <p class="font-montserrat font-bold text-4xl text-white h-[58px] w-[31px] cursor-pointer"
              (click)="toggleMenu($event)">...</p> 

            <!-- Menú emergente -->
            <div *ngIf="menuAbierto"
                class="absolute top-2 left-full w-auto bg-black rounded-lg text-white shadow-lg border border-gray-500 p-1 z-20 whitespace-nowrap">
              <button class="flex flex-row text-left px-1 w-50 py-0.5 rounded-lg hover:bg-gray-400/50 truncate items-center" 
                  (click)="mostrarCarpetas($event)">
                  <img class="w-5 h-5 mr-2" src="assets/folder.png">Añadir a Carpeta</button>
              <button class="flex flex-row text-left px-1 w-50 py-0.5 rounded-lg hover:bg-gray-400/50 truncate items-center" 
                  (click)="borrarLista()">
                  <img class="w-5 h-5 mr-2" src="assets/trash.png">Eliminar Lista</button>
              <button class="flex flex-row text-left px-1 w-50 py-0.5 rounded-lg hover:bg-gray-400/50 truncate items-center" 
                  (click)="cambiarPrivacidad()">
                  <img class="w-5 h-5 mr-2" src="assets/lock.png">Cambiar a {{!visibility ? 'Publica' : 'Privada'}}</button>
            </div>

            <!-- Lista de carpetas -->
            <div *ngIf="carpetasVisibles" 
                class="absolute top-2 left-full max-w-80 w-auto rounded-lg bg-black text-white shadow-lg border border-gray-500 p-2 z-20 whitespace-nowrap">
              <p *ngFor="let carpeta of carpetas" 
                class="px-1 py-0.5 hover:bg-gray-400/50 rounded-lg cursor-pointer truncate" 
                (click)="agregarACarpeta(carpeta.id_carpeta)">
                {{ carpeta.nombre_carpeta }}
              </p>
            </div>
          </div>
        }
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
        <select (change)="sortCMs($event)" class="bg-black border border-gray-300 text-gray-900 text-sm focus:ring-white focus:border-white block w-full dark:bg-black dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-black dark:focus:border-black rounded-md p-1">
          <option value="Fecha_publicación" selected> Fecha de publicación</option>
          <option value="titulo">Título </option>
          <option value="artista">{{ list.es_playlist ? 'Artista' : 'Podcaster'}} </option>
          <option value="duracion">Duracion </option>
          <option value="album">{{ list.es_playlist ? 'Álbum' : 'Podcast'}} </option>
          <option value="valoracion">Tu Valoracion </option>
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
    <!-- cm list -->
        <div class="grid grid-cols-43 gap-4 text-left text-white">
            <div class="font-bold col-span-12">Título</div>
            <div class="font-bold col-span-8">{{ list.es_playlist ? 'Álbum' : 'Podcast'}}</div>
            <div class="font-bold col-span-8">Tu valoración</div>
            <div class="font-bold col-span-8">Fecha en la que se publicó</div>
            <div class="font-bold col-span-2">Duracion</div>
        </div>
        <hr class="border-t-2 border-white my-4 ">  
        <div *ngFor="let cm of contenido"
          class="grid grid-cols-43 gap-4 text-white items-center hover:bg-gray-500/20 rounded-[10px] transition-transform duration-300 hover:scale-101" (dblclick)="addSongsToQueue(cm)">
          <div class="flex m-2 col-span-12 ">
            <div class="relative w-[44px] h-[44px] group mr-5 min-w-[44px]" (click)="addSongsToQueue(cm)">
              <!-- Imagen de la canción -->
              <img [src]="cm.link_imagen" alt="Icono de la canción"
                  class="w-full h-full rounded-[10px] object-cover flex-shrink-0"> 
              
              <!-- Capa oscura con icono de Play -->
              <div class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-[10px]">
                  <img src="assets/play.png" alt="Play"
                      class="w-6 h-6 cursor-pointer">
              </div>
            </div>
            <div class="flex flex-col min-w-0">
              <p class="font-montserrat font-bold text-lg text-white">
                  {{ cm.titulo  }}
              </p>
              <div class="flex flex-row w-full overflow-hidden whitespace-nowrap ">
                <p class="text-white text-sm hover:underline min-w-fill max-w-full " [routerLink]="['/inicio/artista/', encodeNombreArtista(cm.nombre_creador)]">{{cm.nombre_creador}}</p>
                <ng-container *ngIf="cm.artistas_feat != null">
                  <ng-container *ngFor="let ft of getArtistasFeat(cm); track by ft">
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
          <div class="col-span-8"> {{cm.nombre_grupo}}</div>
          <div class="col-span-8 flex"  >
            <ng-container> 
            <img *ngFor="let star of generateStars(cm.valoracion_del_usuario)" [src]="star" alt="star" class="w-5 h-auto flex-col"/>
            <script src="script.js"></script>
            </ng-container>          
            </div> 
            <div class="col-span-8">{{ formatFecha(cm.fecha_pub) }}</div> 
            <div class="col-span-2">{{ formatDurationSong(cm.duracion) }}</div>
            <div class="flex w-42 ml-10 items-center col-span-2"> 
            <div class="relative">
              <div class="p-2 rounded-full flex items-center justify-center cursor-pointer">
                <img
                  src="assets/anyadirplaylist.png"
                  alt="anadir"
                  (click)="toggleBox('cancion', cm)"
                  
                  class="h-[17px] w-auto object-contain z-10 cursor-pointer"
                >
              </div>

              <!-- Popup solo si el ID coincide -->
              <div *ngIf="openedCancionId === cm.id_cancion" #popup2
                  class="h-max-70 w-80 border-1 border-[var(--sponge)] absolute right-10 bottom-0 ml-2 z-50  max-w-xs p-4 bg-[var(--graybackground)] opacity-100 rounded-lg shadow-lg">
                <div class="overflow-y-auto pr-1 ">
                  <div *ngFor="let choice of choices" class="flex items-center gap-2">
                    <input
                      type="checkbox"
                      [(ngModel)]="choice.selected"
                      class="w-5 h-5 cursor-pointer"
                      [ngStyle]="{ 'accent-color': choice.selected ? 'var(--sponge)' : 'white' }"
                      (change)="choice.name === 'Crear nueva lista' ? toggleNewListInput(choice) : null"
                    />
                    <label class="text-white cursor-pointer">{{ choice.name }}</label>
                  </div>
                </div>

                <div *ngIf="showNewListInput" class="mt-2">
                  <input 
                    type="text" 
                    [(ngModel)]="newListName" 
                    placeholder=" Nombre" 
                    class="w-full p-2 rounded text-white focus:ring-white-500 focus:outline-none focus:ring-2"/>
                </div>

                <button
                  (click)="validateSelection_cancion(cm)"
                  class="mt-2 w-full bg-white text-black hover:bg-zinc-600 py-1 rounded transition duration-300"
                >
                  Añadir
                </button>
              </div>
            </div>
            
            <div class="relative p-2 rounded-full flex items-center justify-center cursor-pointer">
              <img src="assets/heart.png" alt="like" (click)="like(cm.id_cm)" class="cursor-pointer h-[17px] w-auto object-contain z-10">
            </div>

            <div class="relative">
              <div class="p-2 rounded-full flex items-center justify-center w-[33px] h-[33px] cursor-pointer">
                <p (click)="toggleBox('option', cm)"
                  class="font-montserrat font-bold text-xl text-white cursor-pointer z-10 leading-none mt-[-5px]">...</p>
              </div>

              <div *ngIf="openedOptionId === cm.id_cancion" #popup3
                  class="border-1 border-[var(--sponge)] absolute right-10 w-50 bottom-0 ml-2 z-50 h-max max-w-xs bg-[var(--graybackground)] opacity-100 rounded-lg shadow-lg">
                <button class="flex flex-row text-left px-1 w-50 py-0.5 rounded-lg hover:bg-gray-400/50 truncate items-center" 
                  (click)="anadirCola(cm)">
                  <img class="w-5 h-5 mr-2" src="assets/queue.png">Añadir a la cola</button>
              </div>
            </div>
          </div>
        </div>
          
          <hr class="border-t-2 border-white my-4">
        </div> 
      </div>
  `,
 
})
 
export class ListaReproducionesComponent implements OnInit {
  id_lista: string = '';
  list: any = null;
  name: string = '';
  color_playlist: string = '';
  contenido_list: any[] = [];
  contenido: any[] = [];
  playlistNotFound = false;
  durationTotal: string = '';
  numberCm: number = 0;
  visibility: boolean = false;
  img_artiste: string = '';
  searchQuery: string = '';
  filteredSongs : any= null;
  order = true;
  menuAbierto: boolean = false;
  carpetasVisibles = false;
  carpetas: any;
  nombre_usuario: string='';
  showNewListInput = false; 
  //to know if the + is open
  openedCancionId = false;
  //to know if the ... is open
  openedOptionId = false;

  //cancion selected when we want to andir or open her options
  songToAdd: any = null;
  
  //list of the aviable playlists to put the songs in it
  playlists: any = [];

  //list based on playlists but with attributes in an other way (name, id, selected)
  choices:any = [];

  //name of the list we want to create
  newListName:string = '';

//color and type of the playslist we want to create
  color = "#A200F4";
  type = "canciones";

  @ViewChild('popup2') popupRef2!: ElementRef;
  @ViewChild('popup3') popupRef3!: ElementRef;

  constructor( 
    private route: ActivatedRoute,
    private titleService: Title, 
    private authService: AuthService, 
    private router: Router, 
    private playerService: PlayerService, 
    private cdRef: ChangeDetectorRef ,
    public userService: UsuarioService,
    private queueService: QueueService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id_lista = params.get('id_lista') ?? '';
      if (this.id_lista) {
        this.getPlaylistData(this.id_lista);
      }
    });
  }
 
  getPlaylistData(id_lista: string) {
    this.authService.getList(id_lista, this.userService.getUsuario()?.nombre_usuario).subscribe({
      next: (data) => {
        if (data) {
          this.list = data;
          this.name = data.nombre;
          this.contenido_list = data.contenido || [];          
          this.contenido = data.contenido || [];
          this.visibility = data.es_publica;
          this.titleService.setTitle(`${data.nombre} | Spongefy`);
          this.durationTotal = this.calculateDurationTotal(this.contenido_list);
          this.playlistNotFound = false;
          this.numberCm = this.contenido_list.length;
          
          if (this.isThisIsPlaylist()) {
            this.handleThisIsPlaylist();
          } else {
            this.color_playlist = data.color;
          } 

        } else {
          this.playlistNotFound = true;
        }
      }, 
      error: (err) => { 
        console.error('Erreur lors de la récupération de la list:', err); 
        this.playlistNotFound = true; 
      } 
    }); 
  }

  calculateDurationTotal(contenido_list: any[]): string {
    let totalSeconds = 0;
    contenido_list.forEach((cm) => {
        if (typeof cm.duracion === 'string' && cm.duracion.includes(':')) {
            const parts = cm.duracion.split(':').map(Number);
            if (parts.length === 3) {
              const [hours, minutes, seconds] = parts;               
              if (!isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {
                  totalSeconds += hours * 3600 + minutes * 60 + seconds;
              } else {
                console.warn('Valeur non numérique détectée dans la durée:', parts);
              }
            } else {
                console.warn('Format de durée incorrect:', cm.duracion);
            }
        } else {
            console.warn('Durée invalide ou manquante:', cm.duracion);
        }
    });
    console.log('Durée totale en secondes:', totalSeconds);
    return this.formatDuration(totalSeconds);
 
  }

  formatDuration(totalSeconds: number): string {
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
      return formatted.trim();
  }

  like(id_cm: number) {
    
    this.nombre_usuario = this.userService.getUsuario().nombre_usuario;
  
    if (!this.nombre_usuario) {
      console.warn("error usario");
      return;
    }
    console.log("nomrbe", this.nombre_usuario)
    console.log("id_cm", id_cm)
    this.authService.addToFav(id_cm, this.nombre_usuario).subscribe({
      next: (response: any) => {

        alert('cancion anadida a los favoritos');

      },
      error: (err) => {
        console.error("error para anadir a los favoritos :", err);
      }
    });
  }
 
  playSong(cm: any) {
    this.authService.playSong(cm.id_cm).subscribe({
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
  @HostListener('document:mousedown', ['$event'])
handleClickOutside(event: Event) {
  // Pour le popup des canciones
  if (this.openedCancionId !== null && this.openedCancionId !== false && 
      this.popupRef2 && !this.popupRef2.nativeElement.contains(event.target) && 
      !(event.target instanceof HTMLElement && event.target.closest('.selector-que-abre-popup2'))) {
    this.openedCancionId = false;
  }
  
  // Pour le popup des options
  if (this.openedOptionId !== null && this.openedOptionId !== false &&
      this.popupRef3 && !this.popupRef3.nativeElement.contains(event.target) && 
      !(event.target instanceof HTMLElement && event.target.closest('.selector-que-abre-popup3'))) {
    this.openedOptionId = false;
  }
}
  getArtistasFeat(cm: any): string[] {
    return cm.artistas_feat ? cm.artistas_feat.split(',').map((artista: string) => artista.trim()) : []; 
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

  cambiarPrivacidad(){
    this.authService.changeListPrivacy(parseInt(this.id_lista), this.userService.getUsuario()?.nombre_usuario).subscribe({
      next: () => {
        this.visibility = !this.visibility;
      },
      error(err) {
        console.error('Error al cambiar la privacidad:', err);
      },
    })
  }

  generateStars(rating: string): string[] {
    const r = parseFloat(rating);
    const stars = [];
    const fullStars = Math.floor(r);
    const hasHalfStar = r % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
    if (rating != null) {
      for (let i = 0; i < fullStars; i++) {
        stars.push("assets/star.png"); // Estrella llena
      }
    
      if (hasHalfStar) {
        stars.push("assets/half_star.png"); // Media estrella
      }
    } else {
      stars.push("assets/star_no_rate.png"); // Estrella llena
    }
    return stars;
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
    const nombre_artista = this.getArtistFromThisIs();
    if (!nombre_artista) return;
    const nombre_artista_encoded = encodeURIComponent(nombre_artista);
    
    if(this.list.es_playlist) {
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
    } else {
      this.authService.getPodcaster(nombre_artista_encoded).subscribe({
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
            } else {
                this.color_playlist = "#FFFFFF"; // Blanco como fallback
            }
        }
    } catch (error) {
        console.error("Error al extraer el color más saturado y brillante:", error);
    } 
  }

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


  sortCMs(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.order = true;
    switch (selectedValue) {
        case 'Fecha_publicación':
            this.contenido.sort((a, b) => new Date(b.fecha_pub).getTime() - new Date(a.fecha_pub).getTime());
            break;
        case 'titulo':
            this.contenido.sort((a, b) => a.titulo.localeCompare(b.titulo));
            break;
        case 'artista':
          this.contenido.sort((a, b) => a.nombre_creador.localeCompare(b.nombre_creador));
          break; 
        case 'duracion':
          this.contenido.sort((a, b) => a.duracion.localeCompare(b.duracion));
          break;
        case 'album':
          this.contenido.sort((a, b) => {
              const nombreA = a.nombre_grupo;
              const nombreB = b.nombre_grupo;

              if (nombreA === null) return 1; // Si A es null, va después de B
              if (nombreB === null) return -1; // Si B es null, A va antes

              return nombreA.localeCompare(nombreB);
          });
          break;
        case 'valoracion':
          this.contenido.sort((a, b) => b.valoracion - a.valoracion);
          break;
    }
  }

  search() {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
        this.contenido = this.contenido_list;
    } else {
        this.contenido = this.contenido_list.filter(cm =>
            (cm.titulo || "").toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            (cm.nombre_creador || "").toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            (cm.artistas_feat || "").toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            (cm.nombre_grupo || "").toLowerCase().includes(this.searchQuery.toLowerCase())
        );
    }
  }

  revert() {
    this.contenido.reverse();
    this.order = !this.order;
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.menuAbierto = !this.menuAbierto;
    this.carpetasVisibles = false; // Ocultar carpetas si el menú se cierra


    // Cierra el menú si se hace clic fuera de él
    setTimeout(() => {
      window.addEventListener("click", this.cerrarMenu.bind(this));
    });
  }

  toggleBox(type:string, song:any) {
    
    if (type === 'cancion') {
      this.openedCancionId = this.openedCancionId === song.id_cancion ? null : song.id_cancion;
      this.songToAdd = song.id_cancion; // 👈 Aquí asignamos la canción actual
    } else if (type === 'option') {
      this.openedOptionId = this.openedOptionId === song.id_cancion ? null : song.id_cancion;
    }

    this.nombre_usuario = this.userService.getUsuario().nombre_usuario;
    
    if (!this.nombre_usuario) {
      console.warn("Usuario no conectado. Error recuperación listas.");
      return;
    }
  
    this.authService.getUserPlaylists(this.userService.getUsuario().nombre_usuario).subscribe(
      (response:any) => {
        this.playlists = response;
        console.log("reponse", response);
        
        // Transformer playlists en choices avec l'attribut selected
        this.choices = this.playlists.map((playlist: Playlist): PlaylistChoice => ({
          name: playlist.nombre,
          id: playlist.id_lista,
          selected: false  // Tous initialisés à false
        }));
        this.choices.push({
          name: "Crear nueva lista",
          selected: false
        });
        console.log("choix", this.choices);
      },
      (error) => {
        console.error('Error al obtener las playlists:', error);
      }
    );
  }

  toggleNewListInput(choice: any) {
    if (choice.name === "Crear nueva lista") {
      this.showNewListInput = choice.selected; 
      if (!choice.selected) {
        this.newListName = ""; 
      }
    }
  }

  validateSelection_cancion(song: any) {
    const selectedPlaylists = this.choices
      .filter((choice: PlaylistChoice) => choice.selected && choice.name !== "Crear nueva lista")
      .map((choice: PlaylistChoice) => ({
        name: choice.name,
        id: choice.id
      }));
  
    if (this.showNewListInput && this.newListName.trim() !== "") {
      this.authService.createPlaylist(this.newListName, this.nombre_usuario, this.color, this.type).subscribe({
        next: (response) => {
          console.log("Nueva lista creada:", response);
          this.authService.getUserPlaylists(this.userService.getUsuario().nombre_usuario).subscribe(
            (response: any) => {
              this.playlists = response;
              console.log("response", response);
              let newPlaylistId;
              for (let playlist of this.playlists) {
                if (this.newListName === playlist.nombre) {
                  console.log("id_nueva_lista", playlist.id_lista);
                  newPlaylistId = playlist.id_lista;
                  break; // Salir del bucle una vez encontrado
                }
              }
              if (newPlaylistId) {
                selectedPlaylists.push({
                  name: this.newListName,
                  id: newPlaylistId
                });
              }  
            });
        },
        error: (err) => console.error("Error lista no creada:", err)
      });
    }
  
    console.log("Playlists selected :", selectedPlaylists);
    console.log("usuario :", this.nombre_usuario);
    for (let selectedPlaylist of selectedPlaylists) {
      console.log("cancion:", song);
      console.log("selectedPlaylist:", selectedPlaylist);
      this.addSongToPlaylist(song, selectedPlaylist);
    }
  }


  addSongToPlaylist(song:any, playlist: any) {
    console.log("song.id_cm:", song.id_cm);
    console.log(" playlist.id_lista", playlist.id);
    this.authService.addSongToPlaylist(song.id_cm, playlist.id).subscribe({
      next: () => {  // No necesitamos la respuesta si no la vamos a usar
        alert('Canción añadida en la playlist');
      
      },
      error: (error) => {
        // Mostrar alerta con el mensaje de error
        alert('Error al añadir la canción a la playlist');
        console.error('Error al añadir la canción:', error);
      }
    });
  }

  anadirCola(song: any) {
    console.log("anadir a la cola");
    this.nombre_usuario = this.userService.getUsuario().nombre_usuario;
    
    if (!this.nombre_usuario) {
      console.warn("Usuario no conectado. Error recuperación listas.");
      return;
    }
    console.log(song.id_cm,"anadir a la cola");
    this.queueService.addToQueue(this.nombre_usuario,song.id_cm).subscribe({
      next: () => {  
        this.playerService.getQueue(this.nombre_usuario);
        alert('Cancion anadida en la cola');
      
      },
      error: (error) => {
        alert('Error al añadir la canción a la playlist');
        console.error('Error al añadir la canción:', error);
      }
    });

    this.openedOptionId = false;
  }

  mostrarCarpetas(event: Event) {
    event.stopPropagation();
    this.authService.listUserFolder(this.userService.getUsuario()?.nombre_usuario) 
      .subscribe((data: any) => {
        this.carpetas = data.carpetas; // Cierra el menú después de hacer clic
      }, error => {
        alert('Hubo un error al añadir la lista.');
      });
    this.carpetasVisibles = false;
    this.menuAbierto = false; // Cerrar el menú principal
    this.carpetasVisibles = true;
  }

  agregarACarpeta(id_carpeta: number) {
    this.authService.addPlaylistToFolder(this.userService.getUsuario()?.nombre_usuario, id_carpeta, this.id_lista)
      .subscribe(response => {
        alert('Lista añadida correctamente.');
        this.menuAbierto = false; // Cierra el menú después de hacer clic
      }, error => {
        alert('Hubo un error al añadir la lista.');
      });
    this.carpetasVisibles = false; // Cerrar el menú de carpetas
  }
  
  cerrarMenu(event: MouseEvent) {
    this.menuAbierto = false;
    this.carpetasVisibles = false;
    window.removeEventListener("click", this.cerrarMenu.bind(this));
  }

  random() {
    const randomIndex = Math.floor(Math.random() * this.contenido.length);
    const randomSong = this.contenido[randomIndex];
    this.playSong(randomSong);
  }


  // Aquí viene el método addSongsToQueue
  addSongsToQueue(selectedSong: any) {
    this.queueService.clearQueue(this.userService.getUsuario()?.nombre_usuario).subscribe(() => {
    });

    const startIndex = this.contenido.indexOf(selectedSong);
    if (startIndex === -1) return;

    const songsToAdd = this.contenido.slice(startIndex);
    if (songsToAdd.length === 0) return;

    const usuario = this.userService.getUsuario()?.nombre_usuario;

    // Crear un observable para la primera canción
    const firstSong$ = this.queueService.addToQueue(usuario, songsToAdd[0].id_cm).pipe(
        tap(() => {
            this.playerService.loadSongByPosition(0); // Cargar la primera canción
        })
    );

    // Crear observables para las demás canciones (con concurrencia limitada)
    const remainingSongs$ = from(songsToAdd.slice(1)).pipe(
        concatMap(song => this.queueService.addToQueue(usuario, song.id_cm).pipe()) // Delay opcional
    );

    // Ejecutar la primera canción de inmediato y luego las demás en secuencia controlada
    firstSong$.pipe(concatWith(remainingSongs$)).subscribe({
        complete: () => {
          console.log('Todas las canciones añadidas a la cola.')
          this.playerService.getQueue(usuario)
        },
        error: err => console.error('Error al añadir canciones:', err)
    });
  }

  borrarLista () {

  }
}
  
