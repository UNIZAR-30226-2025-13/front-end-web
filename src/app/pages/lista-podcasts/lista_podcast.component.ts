import { Component, OnInit, AfterViewInit,ViewChild,ElementRef, Renderer2,HostListener, NgZone } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { PlayerService } from '../../services/player.service';
import { UsuarioService } from '../../services/usuario.service';
import { QueueService } from '../../services/queue.service';
import { concatMap, concatWith, from, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';


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
  selector: 'app-lista-podcasts',
  imports: [CommonModule,FormsModule, RouterModule],
  template: `
  <div class="bg-black pt-4 px-[34px] min-h-screen">

<!-- upper box -->
<div class="flex bg-opacity-60 p-4 rounded-[40px] items-end" [ngStyle]="{'background-color': dominantColor}">
    <div class="flex-row  items-center justify-center ">
        <div class="flex flex-row items-center justify-center space-x-4 ">      
            <img [src]="podcast_icone" id="podcastImage" class=" rounded-[20px] h-[200px] w-[200px] flex items-center justify-center">

            <!-- lista information-->
            <div class="flex flex-col items-start pt-20">
                <p class="text-white">Podcast</p>
                <h1 class="font-montserrat font-bold text-4xl ml-[-2px] text-white">{{ podcast_name }}</h1>
                <div class= "flex flex-row ">
                  <p *ngFor="let creador of creadores.split(',').slice(0,1)"  class=" text-white cursor-pointer min-w-fill max-w-full " [routerLink]="['/inicio/podcaster/',encodeNombreArtista(creador) ]">{{ creador }}</p>
                  <p *ngFor="let creador of creadores.split(',').slice(1)" class=" text-white cursor-pointer min-w-fill max-w-full " [routerLink]="['/inicio/podcaster/',encodeNombreArtista(creador.trim()) ]">, {{ creador.trim() }}<p>
                </div>
            </div>
          </div>
          
          <div class=" flex mt-4 items-center gap-1">
            <div 
              class="h-[52px] w-[52px] mt-2 flex items-center justify-center transition-transform duration-200 cursor-pointer"
              (click)="addSongsToQueue(episodios[0])">
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
     


<div class="m-4">       
<!-- song list -->
<div class="grid grid-cols-32 gap-4 text-left text-white mt-20 items-center">
    <div class="col-span-12">Título</div>
    <div class="col-span-6 text-center">Tu valoración</div>
    <div class="col-span-6 text-center">Valoración Media</div>
    <div class="col-span-4 text-center">Duración</div>
    <div class="col-span-2 text-center"></div>
</div>
<hr class="border-t-2 border-white my-4">  

<div *ngFor="let episodio of episodios" class="grid grid-cols-32 gap-4 text-white items-center rounded-[10px] transition-transform duration-300 hover:scale-101" >
    <div class="flex m-3 ml-0 col-span-12">
        <div class="flex flex-col min-w-0 max-w-md" (click)="addSongsToQueue(episodio)">
            <p class="font-montserrat font-bold text-lg text-white line-clamp-1 " [routerLink]="['/inicio/episodio/',episodio.id_ep ]">
                {{ episodio.nombre_ep }}
            </p>
            <p class="text-white text-sm line-clamp-4">
                {{ episodio.descripcion }}
            </p>
        </div>
    </div>
    
    <div class="col-span-6 flex justify-center items-center">
        <img *ngFor="let star of generateStars(episodio.valoracion_del_usuario)" [src]="star" alt="star" class="w-5 h-auto"/>
    </div> 
    
    <div class="col-span-6 flex justify-center items-center">
        <img *ngFor="let star of generateStars(episodio.valoracion_media)" [src]="star" alt="star" class="w-5 h-auto"/>
    </div> 
    
    <div class="col-span-4 flex justify-center items-center">{{ formatDuration(episodio.duracion) }}</div>

    <div class="flex w-42 ml-10 items-center col-span-2"> 
          <div class="relative">
            <div class="p-2 rounded-full flex items-center justify-center cursor-pointer">
              <img
                src="assets/anyadirplaylist.png"
                alt="anadir"
                (click)="toggleBox('episodio', episodio)"
                
                class="h-[17px] w-auto object-contain z-10 cursor-pointer"
              >
            </div>

            <!-- Popup solo si el ID coincide -->
            <div *ngIf="openedCancionId  === episodio.id_ep" #popup2
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
                (click)="validateSelection_episodio(episodio)"
                class="mt-2 w-full bg-white text-black hover:bg-zinc-600 py-1 rounded transition duration-300"
              >
                Añadir
              </button>
            </div>
          </div>
          
          <div class="relative p-2 rounded-full flex items-center justify-center cursor-pointer">
            <img src="assets/heart.png" alt="like" (click)="like(episodio.id_ep)" class="cursor-pointer h-[17px] w-auto object-contain z-10">
          </div>

          <div class="relative">
            <div class="p-2 rounded-full flex items-center justify-center w-[33px] h-[33px] cursor-pointer">
              <p (click)="toggleBox('option', episodio)"
                class="font-montserrat font-bold text-xl text-white cursor-pointer z-10 leading-none mt-[-5px]">...</p>
            </div>

            <div *ngIf="openedOptionId === episodio.id_ep" #popup3
                class="border-1 border-[var(--sponge)] absolute right-10 w-50 bottom-0 ml-2 z-50 h-max max-w-xs bg-[var(--graybackground)] opacity-100 rounded-lg shadow-lg">
              <button class="flex flex-row text-left px-1 w-50 py-0.5 rounded-lg hover:bg-gray-400/50 truncate items-center" 
                (click)="anadirCola(episodio)">
                <img class="w-5 h-5 mr-2" src="assets/queue.png">Añadir a la cola</button>
            </div>
          </div>
        </div>
      </div>
</div>

</div>
  `,
})
export class ListaPodcastComponent implements OnInit, AfterViewInit {
    dominantColor: string = 'rgba(75, 85, 99, 0.5)'; //TODO
    podcast_name :string = '';//TODO
    podcast_icone:string ='';//TODO
    creadores: string = '' ;//TODO
    
    nombre_usuario:string = '';

    //to know if the option panel of the first block is open
    isOpen = false;
    //to know if the input of the name to the new playlist is open
    showNewListInput = false; 
    //to know if the + of the song is open
    openedCancionId: number | null = null;

    //to know if the option ... of the song is open
    openedOptionId: number | null = null;

    //list of the aviable playlists to put the songs in it
    playlists: any = [];

   //list based on playlists but with attributes in an other way (name, id, selected)
   choices:any = [];

   //name to enter for the new playlist
   newListName:string = '';

  //episodio to add to a lista if the + is clicked over an episodio
  episodioToAdd:any = null;


   //color and type of the playslist we want to create
  color = "#A200F4";
  type = "episodes";

   

    constructor(
        private route: ActivatedRoute,
        private authService: AuthService,
        private titleService: Title,
        private router: Router,
        private playerService: PlayerService,
        private renderer: Renderer2,
        private ngZone: NgZone,
        private userService: UsuarioService,
        private queueService: QueueService
      ) {}
    
    episodios: any

    ngOnInit() {
      this.authService.getPodcast(this.route.snapshot.params['id_podcast'], this.userService.getUsuario()?.nombre_usuario).subscribe((data) => { 
        this.podcast_name = data.podcast.nombre_podcast;
        this.podcast_icone = data.podcast.link_imagen;
        this.creadores = data.creadores.join(", ");
        this.episodios = data.episodios;

        setTimeout(() => {
          const imgElement = document.getElementById('podcastImage') as HTMLImageElement;
          if (imgElement && imgElement.naturalWidth > 0) {
            this.extractColor(imgElement);
          } else {
            console.warn('La imagen aún no está lista, intentándolo de nuevo...');
          }
        }, 1000);
      }
      );
      
      this.titleService.setTitle('Podcast | Spongefy');
    }

    ngAfterViewInit(): void {
      const imgElement = document.getElementById('podcastImage') as HTMLImageElement;
      if (imgElement) {
        imgElement.crossOrigin = 'anonymous'; // Evita errores CORS
        if (imgElement.complete) {
          this.extractColor(imgElement);
        } else {
          imgElement.onload = () => this.extractColor(imgElement);
        }
      }
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

    //to play the first song of the playlist
    playSong(song: any){} //TODO
    //to put in aleatorio mode
    random(){} //TODO
    //to anadir
   
    like(id_cm: number) {
    
      this.nombre_usuario = this.userService.getUsuario().nombre_usuario;
    
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
  
    sort(){}//TODO

    addSongsToQueue(selectedSong: any) {
          this.queueService.clearQueue(this.userService.getUsuario()?.nombre_usuario).subscribe(() => {
          });
      
          const startIndex = this.episodios.indexOf(selectedSong);
          if (startIndex === -1) return;
      
          const songsToAdd = this.episodios.slice(startIndex);
          if (songsToAdd.length === 0) return;
      
          const usuario = this.userService.getUsuario()?.nombre_usuario;
      
          // Crear un observable para la primera canción
          const firstSong$ = this.queueService.addToQueue(usuario, songsToAdd[0].id_ep).pipe(
              tap(() => {
                  this.playerService.loadSongByPosition(0); // Cargar la primera canción
              })
          );
      
          // Crear observables para las demás canciones (con concurrencia limitada)
          const remainingSongs$ = from(songsToAdd.slice(1)).pipe(
              concatMap(song => this.queueService.addToQueue(usuario, this.episodios.id_ep).pipe()) // Delay opcional
          );
      
          // Ejecutar la primera canción de inmediato y luego las demás en secuencia controlada
          firstSong$.pipe(concatWith(remainingSongs$)).subscribe({
              complete: () => {
                this.playerService.getQueue(usuario)
              },
              error: err => console.error('Error al añadir canciones:', err)
          });
        }
    

    formatDuration(duration: string): string {
      const parts = duration.split(':');
      return parts.length === 3 && parts[0] === '00' ? `${parts[1]}:${parts[2]}` : duration;
    }
    @ViewChild('popup') popupRef!: ElementRef;
    @ViewChild('popup2') popupRef2!: ElementRef;
    @ViewChild('popup3') popupRef3!: ElementRef;

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

    toggleBox(type:string, episodio?:any) {
      if (type == "album"){
        this.isOpen = !this.isOpen;
      }
      if (type === "episodio") {
        this.openedCancionId = this.openedCancionId === episodio.id_ep ? null : episodio.id_ep;
        console.log("opened anadir", this.openedCancionId)
        this.episodioToAdd = episodio.id_ep;  
      } else if (type === "option") {
        this.openedOptionId = this.openedOptionId === episodio.id_ep ? null : episodio.id_ep;
      }
      this.nombre_usuario = this.userService.getUsuario().nombre_usuario;
      
      if (!this.nombre_usuario) {
        console.warn("Usuario no conectado. Error recuperación listas.");
        return;
      }
    
      this.authService.getEpisodeList(this.userService.getUsuario().nombre_usuario).subscribe(
        (response:any) => {
          this.playlists = response;
          console.log("reponse", response);
          
          
          this.choices = this.playlists.map((playlist: Playlist): PlaylistChoice => ({
            name: playlist.nombre,
            id: playlist.id_lista,
            selected: false  
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
      this.isOpen = false;
      
      // Filtrer les playlists existantes sélectionnées
      const selectedPlaylists = this.choices
        .filter((choice: PlaylistChoice) => choice.selected && choice.name !== "Crear nueva lista")
        .map((choice: PlaylistChoice) => ({
          name: choice.name,
          id: choice.id
        }));
        
      // Variable pour suivre toutes les playlists (existantes + nouvelle)
      const allSelectedPlaylists = [...selectedPlaylists];
      
      // Fonction pour ajouter toutes les chansons aux playlists
      const addAllSongsToPlaylists = (playlists: any[]) => {
        for (let selectedPlaylist of playlists) {
          for (let cancion of this.episodios) {
            console.log("cancion:", cancion);
            console.log("addSongToPlaylist")
            this.addSongToPlaylist(cancion, selectedPlaylist);
          }
        }
      };
      
    
      if (this.showNewListInput && this.newListName.trim() !== "") {
        this.authService.createPlaylist(this.newListName, this.nombre_usuario, this.color, this.type)
          .subscribe({
            next: (response) => {
              console.log("Nueva lista creada:", response);
              
              
              this.authService.getUserPlaylists(this.userService.getUsuario().nombre_usuario)
                .subscribe({
                  next: (response: any) => {
                    this.playlists = response;
                    console.log("reponse", response);
                    
                    
                    let newPlaylistId;
                    for (let playlist of this.playlists) {
                      if (this.newListName === playlist.nombre) {
                        console.log("id_nueva_lista", playlist.id_lista);
                        newPlaylistId = playlist.id_lista;
                        break;
                      }
                    }
                    
                    if (newPlaylistId) {
                     
                      allSelectedPlaylists.push({
                        name: this.newListName,
                        id: newPlaylistId
                      });
                    }
                    
                    console.log("Playlists selected:", allSelectedPlaylists);
                    console.log("usuario:", this.nombre_usuario);
                    
                    
                    addAllSongsToPlaylists(allSelectedPlaylists);
                  },
                  error: (err) => {
                    console.error("Error al obtener playlists:", err);
             
                    addAllSongsToPlaylists(selectedPlaylists);
                  }
                });
            },
            error: (err) => {
              console.error("Error lista no creada:", err);
          
              addAllSongsToPlaylists(selectedPlaylists);
            }
          });
      } 
      
      else {
        console.log("Playlists selected:", selectedPlaylists);
        console.log("usuario:", this.nombre_usuario);
        addAllSongsToPlaylists(selectedPlaylists);
      }
    }




    addSongToPlaylist(episodio:any, playlist: any) {
      console.log("id_ep:", episodio.id_ep);
      console.log(" playlist_id", playlist.id);
      this.authService.addEpisodioToLista( episodio.id_ep, playlist.id).subscribe({
        next: () => {  // No necesitamos la respuesta si no la vamos a usar
          console.log('episodio anadido');
          
        
        },
        error: (error) => {
          // Mostrar alerta con el mensaje de error
          alert('Error al añadir la canción a la playlist');
          console.error('Error al añadir la canción:', error);
        }
      });
    }

    encodeNombreArtista(nombre: string): string {
      return encodeURIComponent(nombre);
    }

    validateSelection_episodio(song: any) {
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
  
    anadirCola(song: any) {
      console.log("anadir a la cola");
      this.nombre_usuario = this.userService.getUsuario().nombre_usuario;
      
      if (!this.nombre_usuario) {
        console.warn("Usuario no conectado. Error recuperación listas.");
        return;
      }
      this.queueService.addToQueue(this.nombre_usuario,song.id_ep).subscribe({
        next: () => {  
          this.playerService.getQueue(this.nombre_usuario);
          alert('Cancion anadida en la cola');
        
        },
        error: (error) => {
          alert('Error al añadir el episodio a cola');
          console.error('Error al añadir el episodio a cola:', error);
        }
      });
  
      this.openedOptionId = null;
    }
}
