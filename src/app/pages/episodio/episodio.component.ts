import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef,HostListener, ElementRef, } from '@angular/core';
import { CommonModule} from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterModule, Router } from '@angular/router'
import { FormsModule } from '@angular/forms';


import { PlayerService } from '../../services/player.service';

// @ts-ignore
import ColorThief from 'colorthief';
import { UsuarioService } from '../../services/usuario.service';
import { QueueService } from '../../services/queue.service';
interface Playlist {
  nombre: string;
  id_lista: number;
  
}
interface PlaylistChoice {
  name: string;
  id?: number;
  selected: boolean;
}


@Component({
  selector: 'app-episodio',
  imports: [CommonModule, RouterModule,  FormsModule],

  
  template: `<div class="bg-black pt-4 px-[34px] h-full">
  <!-- upper box -->
  <div class="flex flex-col bg-opacity-60 p-4 rounded-[40px] items-start" [ngStyle]="{'background-color': dominantColor}">
    
      <div class="flex flex-row items-center justify-center space-x-4"> <!-- flex-row pour aligner horizontalement -->
       
        <div class="flex flex-col items-start pt-20 text-white">
          <p class="">Episodio</p>
          <h1 class="font-montserrat font-bold text-4xl ml-[-2px] text-white">{{ n_episode }} | {{ n_podcast }}</h1>
          <div class="flex flex-row w-full overflow-hidden whitespace-nowrap ">
            <p class=" cursor-pointer min-w-fill max-w-full " [routerLink]="['/inicio/artista/', encodeNombreArtista(n_podcast)]">{{n_podcast}}</p>
            
            <p>&nbsp;| {{ano}} </p>
          </div>
        </div>
      </div>
      <div class=" flex mt-4 gap-1.5">
          <div 
          class="h-[52px] w-[52px] mt-2 flex items-center justify-center transition-transform duration-200 cursor-pointer"
          (click)="addEpisodeToQueue()">
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
            <img src="assets/anyadirplaylist.png" alt="anadir" (click)="toggleBox()" class="mt-2 w-full h-full transition-transform duration-200">
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
          <div class="p-2 rounded-full relative items-center justify-center w-[52px] h-[52px] cursor-pointer">
              <p (click)="option()"
                class="font-montserrat font-bold text-3xl pt-3 text-white cursor-pointer z-10 leading-none mt-[-5px]">...</p>
            
            <div *ngIf="openedOptionId " #popup3
              class="border-1 border-[var(--sponge)] absolute left-10  top-5 w-50  ml-2 z-50 h-max max-w-xs bg-[var(--graybackground)] opacity-100 rounded-lg shadow-lg">
            <button class="flex flex-row text-white text-left px-1 w-50 py-0.5 rounded-lg hover:bg-gray-400/50 truncate items-center" 
              (click)="anadirCola()">
              <img class="w-5 h-5 mr-2 text-white" src="assets/queue.png">Añadir a la cola</button>
              <button (click)="like()" class="flex flex-row text-white text-left px-1 w-50 py-0.5 rounded-lg hover:bg-gray-400/50 truncate items-center" >
                <img class="w-5 h-5 mr-2 text-white" src="assets/fav.png">anadir a los favoritos
              </button>
              </div>
            </div>

      
      </div>

          
   
      
    
  </div>
  <!-- valorcaion  -->
  <div class="flex  items-center gap-8 m-4 mr-20">
    <!-- Section Tu valoración -->
    <div class="flex flex-col items-start">
        <p class="font-montserrat text-lg text-white text-center">Tu valoración</p> <!-- pouvoir changer en sin valorcaion  -->
        <div class="flex w-[calc(48px * 5)] mt-1">
            <img *ngFor="let star of generateStars(this.valoration)" [src]="star" alt="star" class="w-12 h-auto flex-col"/>
            <script src="script.js"></script>
        </div>
    </div>

    <!-- Section valoración media -->
    <div class="flex flex-col items-start m-4 ml-20">
        <p class="font-montserrat text-lg text-white text-center">Valoración media</p><!-- pouvoir changer en sin valorcaion  media-->
        <div class="flex w-[calc(48px * 5)] mt-1">
            <img *ngFor="let star of generateStars(this.valoration_media)" [src]="star" alt="star" class="w-12 h-auto flex-col"/>
            <script src="script.js"></script>
        </div>
    </div>
  </div>

  <!-- song  -->
  <div class=" ml-4 text-left text-white">
      <p>Descripción</p>
   
  </div>
  <hr class="border-t-2 border-white my-2">  
  <div class="text-white ml-4 mt-4">
      {{episode.descripcion}}<!--remplacer par description -->
  </div>
  <hr class="border-t-2 border-white my-4">  
  <p class="font-montserrat  text-l text-white ml-4"> {{ formatFecha(episode.fecha_pub) }}</p>
</div>  `,
  styleUrl: './episodio.component.css'
})
export class EpisodioComponent {
  constructor(
      private authService: AuthService,
      private titleService: Title,
      private route: ActivatedRoute,
      private router: Router,
      private playerService: PlayerService,
      private userService: UsuarioService,
      private queueService: QueueService
    ) {}
    nombre_usuario:string = "";
    dominantColor: string = 'rgba(0, 70, 50 , 4)'; //TODO mettre à la couleur du podcast
    id_ep: string  = '';
    episode: any;
    n_episode: string = '';
    n_podcast: string = '';
    ano: string = '';
    description : string = '';

    valoration_media: string = '0';
    valoration: string = '0';
    isOpen = false;
    choices:any = []; //todo
    showNewListInput = false; //todo
    newListName = "album";//todo
    playlists: any = [];
    openedOptionId= false;
  
  
  
    ngOnInit() {
      
      this.id_ep = this.route.snapshot.paramMap.get('id_ep') ?? '';
      this.authService.getEpisode(parseInt(this.id_ep)).subscribe((data) => {
        this.episode = data;
        console.log("episode");
        console.log(this.episode);
        this.titleService.setTitle(this.episode.nombre_podcast + ' - ' + this.episode.nombre_ep);
        this.n_episode = this.episode.nombre_ep;
        this.n_podcast = this.episode.nombre_podcast;
        this.ano = this.formatAno(this.episode.fecha_pub);
        
  
      
        this.authService.getRate(parseInt(this.id_ep), this.userService.getUsuario()?.nombre_usuario).subscribe((data) => {
          this.valoration = data.valoracion;
          this.authService.getAverageRate(parseInt(this.id_ep)).subscribe((data) => {
            this.valoration_media = data.valoracion_media;
            console.log(this.valoration_media, "valoration_media");
          });
        });
      });
    }
  
 
    //to add the episodio to the quue
    //TODO
    //to shuffle the queue
    random(){} //TODO


    


    add(){}//TODO
    
 
    
  
  
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
  
    addEpisodeToQueue() {
      const usuario = this.userService.getUsuario()?.nombre_usuario;
      
      this.queueService.clearQueue(this.userService.getUsuario()?.nombre_usuario).subscribe(() => {
      });
      
      if (!usuario || !this.episode) return;
      
      // Añadir solo la canción seleccionada a la cola
      this.queueService.addToQueue(usuario, parseInt(this.id_ep) ).subscribe({
        next: () => {
          // Cargar la canción seleccionada inmediatamente
          this.playerService.loadSongByPosition(0);
          this.playerService.getQueue(usuario);
          console.log('episodio añadida a la cola.');
        },
        error: (err: any) => {
          console.error('Error al añadir el episodio a la cola:', err);
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
  
   
  
    encodeNombreArtista(nombre: string): string {
      return encodeURIComponent(nombre);
    }

     @ViewChild('popup') popupRef!: ElementRef;
     @ViewChild('popup3') popupRef3!: ElementRef;
     

     @HostListener('document:mousedown', ['$event'])
       handleClickOutside(event: Event) {
         if (this.isOpen && this.popupRef && !this.popupRef.nativeElement.contains(event.target)) {
           this.isOpen = false;
           console.log("close pop up")
         }
         if (this.openedOptionId && this.popupRef3 && !this.popupRef3.nativeElement.contains(event.target)) {
          this.openedOptionId = false; // Cerrar el popup de opciones
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

      toggleBox( ) {
        console.log("isOpen", this.isOpen)
        this.isOpen = !this.isOpen;
        console.log("isOpen", this.isOpen)
        this.nombre_usuario = this.userService.getUsuario().nombre_usuario;
        
        if (!this.nombre_usuario) {
          console.warn("Usuario no conectado. Error recuperación listas.");
          return;
        }
      
        this.authService.getUserPlaylists(this.userService.getUsuario().nombre_usuario).subscribe(
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

      validateSelection(){const selectedPlaylists = this.choices
        .filter((choice: PlaylistChoice) => choice.selected && choice.name !== "Crear nueva lista")
        .map((choice: PlaylistChoice) => ({
          name: choice.name,
          id: choice.id
        }));
    
      if (this.showNewListInput && this.newListName.trim() !== "") {
        this.authService.createPlaylist(this.newListName, this.nombre_usuario, this.dominantColor, 'episodios').subscribe({
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
        console.log("episode:", this.episode);
        console.log("selectedPlaylist:", selectedPlaylist);
        this.addSongToPlaylist( selectedPlaylist);
      }
    }
    
    addSongToPlaylist( playlist: any) {
      console.log("id_ep:", this.id_ep);
      console.log(" playlist_id", playlist.id);
      this.authService.addSongToPlaylist( parseInt(this.id_ep), playlist.id).subscribe({
        next: () => {  // No necesitamos la respuesta si no la vamos a usar
          
        
        },
        error: (error) => {
          // Mostrar alerta con el mensaje de error
          alert('Error al añadir la canción a la playlist');
          console.error('Error al añadir la canción:', error);
        }
      });
    }

    anadirCola() {
      console.log("anadir a la cola");
      this.nombre_usuario = this.userService.getUsuario().nombre_usuario;
      
      if (!this.nombre_usuario) {
        console.warn("Usuario no conectado. Error recuperación listas.");
        return;
      }
      this.queueService.addToQueue(this.nombre_usuario,parseInt(this.id_ep)).subscribe({
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


    option(){
      this.openedOptionId = !this.openedOptionId;
    }
    like() {
    
      this.nombre_usuario = this.userService.getUsuario().nombre_usuario;
    
      if (!this.nombre_usuario) {
        console.warn("error usario");
        return;
      }
      
      this.authService.addToFav(parseInt(this.id_ep), this.nombre_usuario).subscribe({
        next: (response: any) => {
  
          alert('episodio anadido en la playlist');
  
        },
        error: (err) => {
          console.error("Erro por anadir a los favoritos :", err);
        }
      });

      this.openedOptionId = false;
    }
}
