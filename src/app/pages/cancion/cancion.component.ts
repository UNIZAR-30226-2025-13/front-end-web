import { Component, OnInit, AfterViewInit,HostListener, ViewChild ,ElementRef } from '@angular/core';
import { CommonModule} from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { RouterModule, Router } from '@angular/router'

import { PlayerService } from '../../services/player.service';

// @ts-ignore
import ColorThief from 'colorthief';
import { UsuarioService } from '../../services/usuario.service';
import { QueueService } from '../../services/queue.service';

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
  selector: 'app-cancion',
  imports: [CommonModule, RouterModule,FormsModule],
  template: `
  <div class="bg-black pt-4 px-[34px] h-full">
    <!-- upper box -->
    <div class="flex bg-opacity-60 p-4 rounded-[40px] items-end" [ngStyle]="{'background-color': dominantColor}">
      <div class="flex-row  items-center justify-center">
        <div class="flex flex-row items-center justify-center space-x-4"> <!-- flex-row pour aligner horizontalement -->
          <img [src]="song.link_imagen" alt="Imagen de la cancion" id="cancionImage" class=" rounded-[20px] h-[200px] w-[200px] flex items-center justify-center">
          <!-- lista information-->
          <div class="flex flex-col items-start pt-20 text-white">
            <p class="">Canción</p>
            <h1 class="font-montserrat font-bold text-4xl ml-[-2px] text-white">{{ song.titulo }}</h1>
            <div class="flex flex-row w-full overflow-hidden whitespace-nowrap ">
              <p class=" cursor-pointer min-w-fill max-w-full " [routerLink]="['/inicio/artista/', encodeNombreArtista(song.autor)]">{{song.autor}}</p>
              <ng-container *ngIf="song.artistas_featuring != null">
                <ng-container *ngFor="let ft of getArtistasFeat(song); track by ft">
                  <p class="inline-block min-w-max">,&nbsp;</p>
                  <p [routerLink]="['/inicio/artista/', encodeNombreArtista(ft)]" 
                    class="cursor-pointer inline-block min-w-max">
                    {{ ft }}
                  </p>
                </ng-container>
              </ng-container>
              <p>&nbsp;| {{ano}} </p>
            </div>
          </div>
        </div>
        <div class=" flex mt-4 gap-1.5 items-center">
          <img src="assets/play.png" alt="play" (click)="addSongToQueue(song)" class=" h-[52px] w-[52px]">
          
          <img src="assets/anyadirplaylist.png" alt="anadir" (click)="toggleBox('up')" class=" h-[52px] w-[52px] mt-2 cursor-pointer duration-200">
          
        </div>
       
      </div>
    </div>
    <div *ngIf="openAddUp" #popup
                  class="border-1 border-[var(--sponge)] absolute  ml-2 h-max max-w-lg w-80 p-4 bg-[var(--graybackground)] opacity-100 rounded-lg z-50 shadow-lg">
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
                <button
                  (click)="validateSelection()"
                  class="mt-2 w-full bg-white text-black hover:bg-zinc-600 py-1 rounded transition duration-300"
                >
                  Añadir
                </button>
              </div>


    <div class="flex  items-center gap-8 m-4 mr-20">
      <!-- Section Tu valoración -->
      <div class="flex flex-col items-start">
          <p class="font-montserrat text-lg text-white text-center">Tu valoración</p>
          <div class="flex w-[calc(48px * 5)] mt-1 cursor-pointer" (click)="toggle_valoracion(song)">
              <img *ngFor="let star of generateStars(this.valoration)" [src]="star" alt="star" class="w-12 h-auto flex-col"/>
              <script src="script.js"></script>
          </div>
          <div *ngIf="openValoracion" #popup4 class="h-max-70 w-80 justify-center border-1 border-[var(--sponge)] absolute   ml-2 z-50  max-w-xs p-4 bg-[var(--graybackground)] opacity-100 rounded-lg shadow-lg">
          <div class="flex justify-center" >   
              <img src= "assets/star.png" alt = "star" (click)="cambiar_valoracion(1)"class="cursor-pointer h-[40px]"> 
              <img src= "assets/star.png" alt = "star" (click)="cambiar_valoracion(2)"class="cursor-pointer h-[40px]"> 
              <img src= "assets/star.png" alt = "star" (click)="cambiar_valoracion(3)"class="cursor-pointer h-[40px]"> 
              <img src= "assets/star.png" alt = "star" (click)="cambiar_valoracion(4)"class="cursor-pointer h-[40px]"> 
              <img src= "assets/star.png" alt = "star" (click)="cambiar_valoracion(5)"class="cursor-pointer h-[40px]"> 
          </div>       
          <button class="flex ml-8 m-1 justify-center text-center px-1 w-50 py-0.5 rounded-lg hover:bg-gray-400/50 truncate items-center" 
                  (click)="removeValoracion()">
                  <img class="w-5 h-5 mr-2 text-center" src="assets/trash.png">
                  <p class="text-white">borrar la nota </p>

                  </button>       
      </div>   
  
      </div>

      <!-- Section valoración media -->
      <div class="flex flex-col items-start m-4 ml-20">
          <p class="font-montserrat text-lg text-white text-center">Valoración media</p>
          <div class="flex w-[calc(48px * 5)] mt-1">
              <img *ngFor="let star of generateStars(this.valoration_media)" [src]="star" alt="star" class="w-12 h-auto flex-col"/>
              <script src="script.js"></script>
          </div>
      </div>
    </div>

    <!-- song  -->
    <div class="grid grid-cols-12 gap-4 text-left text-white">
        <div class="  ml-4 col-span-6 ">Título</div>
        <div class=" col-span-4 ">Reproduciones</div>
        <div class=" col-span-1">Duracion</div>
    </div>
    <hr class="border-t-2 border-white my-2">  
    <div class="grid grid-cols-12 gap-4 group ml-4 text-white items-center rounded-[10px] transition-transform duration-300 hover:scale-101" (dblclick)="addSongToQueue(song)">   
      <div class="flex m-2 ml-0 col-span-6">
        <div class="relative w-[44px] h-[44px] mr-1 min-w-[44px]" (click)="addSongToQueue(song)">                
            <!-- Capa oscura con icono de Play -->
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[10px]">
                <img src="assets/play.png" alt="Play"
                    class="w-6 h-6 cursor-pointer">
            </div>
        </div> 
        <div class="flex flex-col">
          <p class="font-montserrat font-bold text-lg text-white">
              {{ song.titulo  }}
          </p>
          <div class="flex flex-row w-full overflow-hidden whitespace-nowrap ">
              <p class="text-white text-sm hover:underline min-w-fill max-w-full " [routerLink]="['/inicio/artista/', encodeNombreArtista(song.autor)]">{{song.autor}}</p>
              <ng-container *ngIf="song.artistas_featuring != null">
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
      <div class="col-span-4">{{ song.reproducciones | number:'1.0-0':'es-ES' }}</div>
      <div class="col-span-1">{{ formatDurationSong(song.duracion) }}</div>
      <div class=" flex items-center space-x-3   col-span-1 justify-right ">
          <img src="assets/anyadirplaylist.png" alt="anadir" (click)="toggleBox('bottom')" class=" h-[17px] w-[18px]">
          <div *ngIf="openAddBottom" #popup1
                  class="border-1 border-[var(--sponge)] absolute right-10 ml-2 h-max max-w-lg w-80 p-4 bg-[var(--graybackground)] opacity-100 rounded-lg z-50 shadow-lg">
                <div class="max-h-30 overflow-y-auto pr-1 w-full">
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
                <button
                  (click)="validateSelection()"
                  class="mt-2 w-full bg-white text-black hover:bg-zinc-600 py-1 rounded transition duration-300"
                >
                  Añadir
                </button>
              </div>
          <img src="assets/heart.png" alt="like" (click)="like()" class=" h-[17px] w-[18px]">
      </div>

    </div>
    <hr class="border-t-2 border-white my-4">  
    <p class="font-montserrat  text-l text-white ml-4"> {{ formatFecha(song.fecha_pub) }}</p>
  </div>  
  `,
})
export class CancionComponent implements OnInit, AfterViewInit {
  
  constructor(
    private authService: AuthService,
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router,
    private playerService: PlayerService,
    private userService: UsuarioService,
    private queueService: QueueService
  ) {}
  
  dominantColor: string = 'rgba(0, 70, 50 , 4)'; //TODO
 

  song: any;
  id_cancion: string = '';
  ano: string = '';
  artista: string = '';
  valoration_media: string = '0';
  valoration: string = '0';
  nombre_usuario :string = '';
  // to know if valoration is open
  openValoracion = false;
// to know if + from the up div is open
  openAddUp = false;
//to konw if + from the bottom div is open
  openAddBottom = false;

//list based on playlists but with attributes in an other way (name, id, selected) 
  choices:any = [];

  //list of the aviable playlists to put the songs in it
  playlists: any = [];

  //tells if the selection of a new playlist is selectionned
  showNewListInput = false; 

  //name of the list we want to create
  newListName:string = '';


//linked to + up
@ViewChild('popup') popupRef!: ElementRef;

//linked to + bottom
@ViewChild('popup1') popupRef1!: ElementRef;
  
//linked to tu valoracion
@ViewChild('popup4') popupRef4!: ElementRef;

  ngOnInit() {
    this.id_cancion = this.route.snapshot.paramMap.get('id_cancion') ?? '';
    this.authService.showSong(parseInt(this.id_cancion)).subscribe((data) => {
      this.song = data;
      console.log(this.song);
      this.titleService.setTitle(this.song.titulo + ' - ' + this.song.autor);
      this.artista = this.song.autor;
      this.ano = this.formatAno(this.song.fecha_pub);

      // Extraire la couleur dominante
      const imgElement = document.getElementById('cancionImage') as HTMLImageElement;
      if (imgElement) {
        imgElement.crossOrigin = 'anonymous'; // Evita errores CORS
        if (imgElement.complete) {
          this.extractColor(imgElement);
        } else {
          imgElement.onload = () => this.extractColor(imgElement);
        }
      }

      this.authService.getRate(parseInt(this.id_cancion), this.userService.getUsuario()?.nombre_usuario).subscribe((data) => {
        this.valoration = data.valoracion;
        this.authService.getAverageRate(parseInt(this.id_cancion)).subscribe((data2) => {
          this.valoration_media = data2.valoracion_media;
        });
      });
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const imgElement = document.getElementById('cancionImage') as HTMLImageElement;
      if (imgElement && imgElement.naturalWidth > 0) {
        this.extractColor(imgElement);
      } else {
        console.warn('La imagen aún no está lista, intentándolo de nuevo...');
      }
    }, 1000);
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
        stars.push("assets/half-star.png"); // Media estrella
      }
    } else {
      stars.push("assets/star_no_rate.png"); // Estrella llena
    }
    return stars;
  }

  addSongToQueue(selectedSong: any) {
    const usuario = this.userService.getUsuario()?.nombre_usuario;
    console.log('Cancion seleccionada:', selectedSong);
    this.queueService.clearQueue(this.userService.getUsuario()?.nombre_usuario).subscribe(() => {
    });
    
    if (!usuario || !selectedSong) return;
  
    // Añadir solo la canción seleccionada a la cola
    this.queueService.addToQueue(usuario, selectedSong.id_cancion).subscribe({
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

  getArtistasFeat(song: any): string[] {
    return song.artistas_featuring ? song.artistas_featuring.split(',').map((artista: string) => artista.trim()) : [];
  }

  encodeNombreArtista(nombre: string): string {
    return encodeURIComponent(nombre);
  }

  toggle_valoracion(song:any){
      
    this.openValoracion = !this.openValoracion;

    
  }

  cambiar_valoracion( valor:number){
    this.openValoracion =false;
    const usuario = this.userService.getUsuario()?.nombre_usuario;
    console.log("this.d_cancion");
    if (this.valoration != null)
    {
      this.authService.deleteRate(parseInt(this.id_cancion),usuario,).subscribe({
        next: () => {  // No necesitamos la respuesta si no la vamos a usar
          console.log("valo",this.valoration);
          console.log('delete value');
          console.log('id_cancion:', this.id_cancion);
          console.log('usuario:', usuario);
       
          this.authService.postRate(parseInt(this.id_cancion),usuario,valor).subscribe({
            next: () => {  // No necesitamos la respuesta si no la vamos a usar
              console.log('cambio de valor');
              this.ngOnInit()
              
            },
            error: (error) => {
              // Mostrar alerta con el mensaje de error
              alert('Error para cambiar de notacion');
              console.error('Error para cambiar de notacion:', error);
            }
          });
        },
        error: (error) => {
          // Mostrar alerta con el mensaje de error
          alert('Error para cambiar de notacion');
          console.error('Error para cambiar de notacion:', error);
        }
      });
    }
    else{
    this.authService.postRate(parseInt(this.id_cancion),usuario,valor).subscribe({
      next: () => {  // No necesitamos la respuesta si no la vamos a usar
        console.log('cambio de valor');
        this.ngOnInit()
      },
      error: (error) => {
        // Mostrar alerta con el mensaje de error
        alert('Error para cambiar de notacion');
        console.error('Error para cambiar de notacion:', error);
      }
    });
  }  
  }

removeValoracion(){
  
  this.openValoracion =false;
  const usuario = this.userService.getUsuario()?.nombre_usuario;
  
    if (this.valoration!= null)
    {
      this.authService.deleteRate(parseInt(this.id_cancion),usuario).subscribe({
        next: () => {  // No necesitamos la respuesta si no la vamos a usar
          console.log('delete value');
          this.ngOnInit()

          
        },
        error: (error) => {
          // Mostrar alerta con el mensaje de error
          alert('Error para cambiar de notacion');
          console.error('Error para cambiar de notacion:', error);
        }
      });
}}

toggleBox(type:string){
  if(type==='up'){
    this.openAddUp=!this.openAddUp;
    
  }

  if(type==='bottom'){
    this.openAddBottom =! this.openAddBottom;
    
  }

  this.nombre_usuario = this.userService.getUsuario().nombre_usuario;
    
    if (!this.nombre_usuario) {
      console.warn("Usuario no conectado. Error recuperación listas.");
      return;
    }

    this.authService.getUserPlaylists(this.nombre_usuario).subscribe(
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

validateSelection() {
  this.openAddUp = false;
  const selectedPlaylists = this.choices
    .filter((choice: PlaylistChoice) => choice.selected && choice.name !== "Crear nueva lista")
    .map((choice: PlaylistChoice) => ({
      name: choice.name,
      id: choice.id
    }));

  if (this.showNewListInput && this.newListName.trim() !== "") {
    this.authService.createPlaylist(this.newListName, this.nombre_usuario, this.dominantColor, "canciones").subscribe({
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
                break; 
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
    console.log("cancion:",this.song);
    console.log("selectedPlaylist:", selectedPlaylist);
    this.addSongToPlaylist(this.song, selectedPlaylist);
  }}

  addSongToPlaylist(song:any, playlist: any) {
    console.log("song.id_cm:", song.id_cancion);
    console.log(" playlist.id_lista", playlist.id);
    
   
    this.authService.addSongToPlaylist(song.id_cancion, playlist.id).subscribe({
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

like() {
    
  this.nombre_usuario = this.userService.getUsuario().nombre_usuario;

  if (!this.nombre_usuario) {
    console.warn("error usario");
    return;
  }
  console.log("id_cancion", this.id_cancion)
  this.authService.addToFav(parseInt(this.id_cancion), this.nombre_usuario).subscribe({
    next: (response: any) => {

      alert('cancion anadida en la playlist');

    },
    error: (err) => {
      console.error("Erreur lors de l'ajout aux favoris :", err);
    }
  });
}


@HostListener('document:mousedown', ['$event'])
  handleClickOutside(event: Event) {
    if (this.openAddUp && this.popupRef && !this.popupRef.nativeElement.contains(event.target)) {
      this.openAddUp = false;
    }

    if (this.openAddBottom && this.popupRef1 && !this.popupRef1.nativeElement.contains(event.target)) {
      this.openAddBottom = false;
    }


    if(this.openValoracion !==null &&   this.openValoracion !== false  && this.popupRef4 && !this.popupRef4.nativeElement.contains(event.target) && 
  !(event.target instanceof HTMLElement && event.target.closest('.selector-que-abre-popup4'))) {
this.openValoracion = false;
}
  }
}

