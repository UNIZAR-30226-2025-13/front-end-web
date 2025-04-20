import { Component, OnInit, AfterViewInit, ChangeDetectorRef,ElementRef, HostListener, ViewChild   } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { Title } from '@angular/platform-browser';
import { PlayerService } from '../../services/player.service';
import { FormsModule } from '@angular/forms';



// @ts-ignore
import ColorThief from 'colorthief';
import { QueueService } from '../../services/queue.service';
import { concatMap, concatWith, from, tap } from 'rxjs';

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
  
  selector: 'app-album',
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
  <div class="bg-black pt-4 px-[34px] min-h-screen">
  <!-- upper box -->
  <div class="flex bg-opacity-60 p-4 rounded-[40px] items-end" [ngStyle]="{'background-color': dominantColor}">
      <div class="flex-row  items-center justify-center">
          <div class="flex flex-row items-center justify-center space-x-4"> 
            
              <img [src]="album_icone" id="albumImage" class="rounded-[40px] h-[200px] w-[200px] flex items-center justify-center">

              <!-- lista information-->
              <div class="flex flex-col items-start pt-20">
                  <p class="text-white">Álbum</p>
                  <h1 class="font-montserrat font-bold text-4xl ml-[-2px] text-white">{{ album_name }}</h1>
                  <p class="text-white">{{artista}} | {{ano}} | {{nb_cancione}} canciones | {{tiempo}}</p>
              </div>
          </div>
          <div class=" flex mt-4 items-center gap-1">
            <div 
              class="h-[52px] w-[52px] mt-2 flex items-center justify-center transition-transform duration-200 cursor-pointer"
              (click)="addSongsToQueue(songs[0])">
              <img 
              class="w-full h-full transition-transform duration-200"
              src="assets/play.png">
           </div>
           <div class="mt-2 rounded-full flex items-center justify-center cursor-pointer">
              <img src="assets/aleatorio.png" alt="aleatorio" (click)="random()" class=" items-center justify-center h-[52px] w-[52px] cursor-pointer z-10">
           </div> 
           <div class="relative flex items-center">
              <!-- Botón que abre el popup -->
              <div class="h-[52px] w-[52px] flex items-center justify-center transition-transform duration-200 cursor-pointer">
                <img src="assets/anyadirplaylist.png" alt="anadir" (click)="toggleBox('album')" class="mt-2 w-full h-full transition-transform duration-200">
              </div>

              <!-- Popup (posicionado absolutamente respecto al contenedor padre) -->
              <div *ngIf="isOpen" #popup  
                  class="border-1 border-[var(--sponge)] absolute left-full top-0 ml-2 h-max max-w-lg w-80 p-4 bg-[var(--graybackground)] opacity-100 rounded-lg z-50 shadow-lg">
                <div class="max-h-50 overflow-y-auto pr-1 w-full">
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
                  (click)="validateSelection()"
                  class="mt-2 w-full bg-white text-black hover:bg-zinc-600 py-1 rounded transition duration-300"
                >
                  Añadir
                </button>
              </div>
        </div>
      </div>
    </div>  
  </div>

  <div class = "relative">        
    <!-- song list -->
    <div class="grid grid-cols-43 text-left text-white mt-10">
        <div class=" col-span-12">Título</div>
        <div class=" col-span-8 ">Reproducciones</div>
        <div class=" col-span-8">Tu valoración</div>
        <div class=" col-span-8">Valoración Media</div>
        <div class=" col-span-2">Duracion</div>
        <div class=" col-span-2"></div>
    </div>
    <hr class="border-t-2 border-white my-2 ">  
    <div *ngFor="let song of songs; trackBy: trackByFn" class="group grid grid-cols-43  text-white items-center hover:bg-gray-500/20 rounded-[10px] transition-transform duration-300 hover:scale-101" (dblclick)="addSongsToQueue(song)">
        <div class="flex m-2  col-span-12 "> 
            <div class="relative w-[44px] h-[44px] mr-1 min-w-[44px]" (click)="addSongsToQueue(song)">                
                <!-- Capa oscura con icono de Play -->
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[10px]">
                    <img src="assets/play.png" alt="Play"
                        class="w-6 h-6 cursor-pointer">
                </div>
            </div>     
            <div class="flex flex-col min-w-0">
                <p class="font-montserrat font-bold text-lg text-white">
                    {{ song.titulo}}
                </p>
                <div class="flex flex-row w-full overflow-hidden whitespace-nowrap ">
                    <p class="text-white text-sm hover:underline min-w-fill max-w-full " [routerLink]="['/inicio/artista/', encodeNombreArtista(song.nombre_artista)]">{{song.nombre_artista}}</p>
                    <ng-container *ngIf="song.artistas_feat != null">
                      <ng-container *ngFor="let ft of getArtistasFeat(song); trackByFn">
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
        <div class="col-span-8">{{ song.n_repros | number:'1.0-0':'es-ES' }}</div>
        <div class="col-span-8 flex"  >
            <img *ngFor="let star of generateStars(song.tu_valoration);trackBy: trackByFn" [src]="star" alt="star" class="w-5 h-auto flex-col"/>
          <script src="script.js"></script>
        </div> 
        <div class="col-span-8 flex"  >
            <!-- change condition to agree with the database-->
            <img *ngFor="let star of generateStars(song.valoration_media);trackBy: trackByFn" [src]="star" alt="star" class="w-5 h-auto flex-col"/>
          <script src="script.js"></script>
        </div> 
        <div class="col-span-2 flex">{{ formatDurationSong(song.duracion) }}</div>
        <div class="flex w-42 ml-10 items-center col-span-2"> 
          <div class="relative">
            <div class="p-2 rounded-full flex items-center justify-center cursor-pointer">
              <img
                src="assets/anyadirplaylist.png"
                alt="anadir"
                (click)="toggleBox('cancion', song)"
                
                class="h-[17px] w-auto object-contain z-10 cursor-pointer"
              >
            </div>

            <!-- Popup solo si el ID coincide -->
            <div *ngIf="openedCancionId === song.id_cancion" #popup2
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
                (click)="validateSelection_cancion(song)"
                class="mt-2 w-full bg-white text-black hover:bg-zinc-600 py-1 rounded transition duration-300"
              >
                Añadir
              </button>
            </div>
          </div>
          
          <div class="relative p-2 rounded-full flex items-center justify-center cursor-pointer">
            <img src="assets/heart.png" alt="like" (click)="like(song.id_cancion)" class="cursor-pointer h-[17px] w-auto object-contain z-10">
          </div>

          <div class="relative">
            <div class="p-2 rounded-full flex items-center justify-center w-[33px] h-[33px] cursor-pointer">
              <p (click)="toggleBox('option', song)"
                class="font-montserrat font-bold text-xl text-white cursor-pointer z-10 leading-none mt-[-5px]">...</p>
            </div>

            <div *ngIf="openedOptionId === song.id_cancion" #popup3
                class="border-1 border-[var(--sponge)] absolute right-10 w-50 bottom-0 ml-2 z-50 h-max max-w-xs bg-[var(--graybackground)] opacity-100 rounded-lg shadow-lg">
              <button class="flex flex-row text-left px-1 w-50 py-0.5 rounded-lg hover:bg-gray-400/50 truncate items-center" 
                (click)="anadirCola(song)">
                <img class="w-5 h-5 mr-2" src="assets/queue.png">Añadir a la cola</button>
            </div>
          </div>
        </div>
      </div>
      <hr class="border-t-2 border-white my-4">  
    </div> 
  </div> 
  <p class="font-montserrat  text-l text-white ml-4 mb-5">{{fecha}}</p>   
`,
})

export class AlbumComponent implements OnInit, AfterViewInit {
  isPlayer = false;
  id_album: number = 0;
  album: any = null;
  songs:any[] = [];
  AlbumNotFound = false;
  album_name :string = '';
  album_icone:string ='';
  nb_cancione:number = 0;
  tiempo:string ='';
  artista:string = '';
  fecha:string='';
  dominantColor:string = 'rgba(176, 206, 248, 0.5)';
  ano:string = '';
  usuario :any = null;
  nombre_usuario:string = '';
  showPlaylistPopup = false;
  currentSong: any = null;
 
 
  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private authService: AuthService,
    private usuarioService :UsuarioService,
    private router: Router,
    private playerService: PlayerService,
    private cdRef: ChangeDetectorRef, 
    private queueService: QueueService 
  ) {}

  ngOnInit() {
    // Code existant pour charger l'album...
    this.route.paramMap.subscribe((params) => {
      const id_album = parseInt(this.route.snapshot.paramMap.get('id_album') ?? '', 10);
  
      if (isNaN(id_album)) {
        console.error('Album ID fails');
        this.AlbumNotFound = true;
        return;
      }
      if (id_album) {
        this.getAlbumData(id_album);
      } else {
        this.AlbumNotFound = true;
      }
    });

    // Abonnement à l'état de lecture du player
    this.playerService.playState$.subscribe(isPlaying => {
      console.log("Événement playState$ reçu:", isPlaying);
     
      // Forcer la mise à jour de l'interface
      this.cdRef.detectChanges();
    });

  }

  ngAfterViewInit() {
    setTimeout(() => {
      const imgElement = document.getElementById('albumImage') as HTMLImageElement;
      if (imgElement && imgElement.naturalWidth > 0) {
        this.extractColor(imgElement);
      } else {
        console.warn('La imagen aún no está lista, intentándolo de nuevo...');
      }
    }, 1000);
  }

  generateStars(rating: any): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
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

  getAlbumData(id_album: number) {
    this.authService.getInfoAlbum(id_album).subscribe({
      next: (data) => {
        if (data) {
          this.album = data;
          this.album_name = this.album.album.nombre;
          this.artista = this.album.artista;
          this.album_icone = this.album.album.link_imagen;
          
          // S'assurer que les chansons sont correctement assignées
          this.songs = this.album.canciones || [];
          this.titleService.setTitle(`${this.album.album.nombre} | Spongefy`);
          this.tiempo = this.calculateDurationTotal(this.songs);
          this.ano = this.formatAno(this.album.album.fecha_pub);
          this.fecha = this.formatFecha(this.album.album.fecha_pub);
          this.nb_cancione = this.songs.length;
          this.AlbumNotFound = false;
  
          // Extraire la couleur dominante
          const imgElement = document.getElementById('albumImage') as HTMLImageElement;
          if (imgElement) {
            imgElement.crossOrigin = 'anonymous'; // Evita errores CORS
            if (imgElement.complete) {
              this.extractColor(imgElement);
            } else {
              imgElement.onload = () => this.extractColor(imgElement);
            }
          }
        } else {
          this.AlbumNotFound = true;
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de l\'album:', err);
        this.AlbumNotFound = true;
      }
    });
  }


  calculateDurationTotal(canciones_playlist: any[]): string {
    let totalSeconds = 0;
    canciones_playlist.forEach((cancion) => {
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
  
  trackByFn(index: number, item: any): any {
    return index; // ou utilisez un identifiant unique de l'élément si disponible
  }

    
  getArtistasFeat(song: any): string[] {
    return song.artistas_feat ? song.artistas_feat.split(',').map((artista: string) => artista.trim()) : [];
  }

  encodeNombreAlbum(nombre: string): string {
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

  formatAno(fechaString:string): string{
    return fechaString.match(/\d{4}/)?.[0] || "";
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

  encodeNombreArtista(nombre: string): string {
    return encodeURIComponent(nombre);
  }

  random() { 
    console.log("i'm going to suffle the queue")
    this.nombre_usuario = this.usuarioService.getUsuario().getUsuario;
  
    if (!this.nombre_usuario) {
      console.error("Error: Nombre de usuario no definido.");
      return;
    }
  
    this.authService.shuffle(this.nombre_usuario, 0).subscribe({
      next: (response: any) => {
        if (!response || typeof response !== 'object') {
          console.error("Error: Respuesta inválida del servidor.");
          return;
        }
  
        if (response.link_cm) {
          this.playerService.playSong(response);
        } else {
          console.warn("Advertencia: No se encontró 'link_cm' en la respuesta.");
        }
      },
      error: (err) => {
        console.error("Error al reproducir la canción:", err);
      },
    });
  }

  like(id_cm: number) {
    
    this.nombre_usuario = this.usuarioService.getUsuario().nombre_usuario;
  
    if (!this.nombre_usuario) {
      console.warn("error usario");
      return;
    }
    console.log("id_cm", id_cm)
    this.authService.addToFav(id_cm, this.nombre_usuario).subscribe({
      next: (response: any) => {

        alert('cancion anadida en la playlist');

      },
      error: (err) => {
        console.error("Erreur lors de l'ajout aux favoris :", err);
      }
    });
  }
  isOpen = false;
  
  @ViewChild('popup') popupRef!: ElementRef;
  @ViewChild('popup2') popupRef2!: ElementRef;
  @ViewChild('popup3') popupRef3!: ElementRef;
  
  
  openedCancionId: number | null = null;
  openedOptionId: number | null = null;

  choices:any = [];
  playlists: any = [];
  
  showNewListInput = false; 
  newListName = "";
  
  color = "#A200F4";
  type = "canciones";
  songToAdd:any = null;
  


  @HostListener('document:mousedown', ['$event'])
  handleClickOutside(event: Event) {
    if (this.isOpen && this.popupRef && !this.popupRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
    if (this.openedCancionId && this.popupRef2 && !this.popupRef2.nativeElement.contains(event.target)) {
      this.openedCancionId = null; // Cerrar el popup de esa canción
    }
    if (this.openedOptionId && this.popupRef3 && !this.popupRef3.nativeElement.contains(event.target)) {
      this.openedOptionId = null; // Cerrar el popup de opciones
    }
  }

  toggleNewListInput(choice: any) {
    if (choice.name === "Crear nueva lista") {
      this.showNewListInput = choice.selected; 
      if (!choice.selected) {
        this.newListName = ""; 
      }
    }
  }

 option(song: any){
  console.log("option open")
  this.openedOptionId = song.id_cancion;
  this.songToAdd = song;
 }
    
  toggleBox(type:string, song?:any) {
    if (type == "album"){
      this.isOpen = !this.isOpen;
    }
    if (type === 'cancion') {
      this.openedCancionId = this.openedCancionId === song.id_cancion ? null : song.id_cancion;
      this.songToAdd = song.id_cancion; // 👈 Aquí asignamos la canción actual
    } else if (type === 'option') {
      this.openedOptionId = this.openedOptionId === song.id_cancion ? null : song.id_cancion;
    }

    this.nombre_usuario = this.usuarioService.getUsuario().nombre_usuario;
    
    if (!this.nombre_usuario) {
      console.warn("Usuario no conectado. Error recuperación listas.");
      return;
    }
  
    this.authService.getUserPlaylists(this.usuarioService.getUsuario().nombre_usuario).subscribe(
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



    validateSelection() {
      this.isOpen = false
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
          
          this.authService.getUserPlaylists(this.usuarioService.getUsuario().nombre_usuario).subscribe(
            (response: any) => {
              this.playlists = response;
              console.log("reponse", response);
              
              // Chercher la playlist avec le nom correspondant
              let newPlaylistId;
              for (let playlist of this.playlists) {
                if (this.newListName === playlist.nombre) {
                  console.log("id_nueva_lista", playlist.id_lista);
                  newPlaylistId = playlist.id_lista;
                  break; // Sortir de la boucle une fois trouvé
                }
              }
              if (newPlaylistId) {
                // Ajouter la playlist à selectedPlaylists
                selectedPlaylists.push({
                  name: this.newListName,
                  id: newPlaylistId
                });
                console.log("Playlists selected :", selectedPlaylists);
                console.log("usuario :", this.nombre_usuario);
                
                for(let selectedPlaylist of selectedPlaylists){
                  for (let cancion of this.songs){    
                    console.log("cancion:", cancion);                   
                    this.addSongToPlaylist(cancion, selectedPlaylist);
                  }
                }         
              }  
            })
        },
        error: (err) => console.error("Error lista no creada:", err)
        });
      }
      if (!(this.showNewListInput && this.newListName.trim() !== "")) {
        console.log("Playlists selected :", selectedPlaylists);
        console.log("usuario :", this.nombre_usuario);
        for(let selectedPlaylist of selectedPlaylists){
          for (let cancion of this.songs){
            console.log("cancion:", cancion);
            this.addSongToPlaylist(cancion, selectedPlaylist);
          }
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
          this.authService.getUserPlaylists(this.usuarioService.getUsuario().nombre_usuario).subscribe(
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
  

  

  // Aquí viene el método addSongsToQueue
    addSongsToQueue(selectedSong: any) {
      this.queueService.clearQueue(this.usuarioService.getUsuario()?.nombre_usuario).subscribe(() => {
      });
  
      const startIndex = this.songs.indexOf(selectedSong);
      if (startIndex === -1) return;
  
      const songsToAdd = this.songs.slice(startIndex);
      if (songsToAdd.length === 0) return;
  
      const usuario = this.usuarioService.getUsuario()?.nombre_usuario;
  
      // Crear un observable para la primera canción
      const firstSong$ = this.queueService.addToQueue(usuario, songsToAdd[0].id_cancion).pipe(
          tap(() => {
              this.playerService.loadSongByPosition(0); // Cargar la primera canción
          })
      );
  
      // Crear observables para las demás canciones (con concurrencia limitada)
      const remainingSongs$ = from(songsToAdd.slice(1)).pipe(
          concatMap(song => this.queueService.addToQueue(usuario, song.id_cancion).pipe()) // Delay opcional
      );
  
      // Ejecutar la primera canción de inmediato y luego las demás en secuencia controlada
      firstSong$.pipe(concatWith(remainingSongs$)).subscribe({
          complete: () => {
            this.playerService.getQueue(usuario)
          },
          error: err => console.error('Error al añadir canciones:', err)
      });
    }


  addSongToPlaylist(song:any, playlist: any) {
    console.log("song.id_cm:", song.id_cancion);
    console.log(" playlist.id_lista", playlist.id);
    this.authService.addSongToPlaylist(song.id_cancion, playlist.id).subscribe({
      next: () => {  // No necesitamos la respuesta si no la vamos a usar
        
      
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
    this.nombre_usuario = this.usuarioService.getUsuario().nombre_usuario;
    
    if (!this.nombre_usuario) {
      console.warn("Usuario no conectado. Error recuperación listas.");
      return;
    }
    this.queueService.addToQueue(this.nombre_usuario,song.id_cancion).subscribe({
      next: () => {  
        this.playerService.getQueue(this.nombre_usuario);
        alert('Cancion anadida en la cola');
      
      },
      error: (error) => {
        alert('Error al añadir la canción a la playlist');
        console.error('Error al añadir la canción:', error);
      }
    });

    this.openedOptionId = null;
  }
}