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
  // Ajoutez d'autres propriétés si nécessaire
}

@Component({
  
  selector: 'app-album',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './album.component.html',
  styleUrl: './album.component.css'
})

export class AlbumComponent implements OnInit, AfterViewInit {
  isPlaying = false;
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
   
  //to anadir

  
 
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
      
      // Mise à jour directe de isPlaying
      this.isPlaying = isPlaying;
      
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
          console.log("Chansons chargées:", this.songs);
          
          this.titleService.setTitle(`${this.album.album.nombre} | Spongefy`);
          this.tiempo = this.calculateDurationTotal(this.songs);
          this.ano = this.formatAno(this.album.album.fecha_pub);
          this.fecha = this.formatFecha(this.album.album.fecha_pub);
          this.nb_cancione = this.songs.length;
          this.AlbumNotFound = false;
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

    if (!this.isPlaying){
      this.playAlbum()
    }
  
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

  // Aquí viene el método addSongsToQueue
  addSongsToQueue(selectedSong: any) {
    console.log("Ajout des chansons à la queue, commençant par:", selectedSong.titulo);
    const usuario = this.usuarioService.getUsuario()?.nombre_usuario;
    
    if (!usuario) {
      console.error("Utilisateur non connecté");
      return;
    }
    
    // Vider la queue actuelle
    this.queueService.clearQueue(usuario).subscribe({
      next: () => {
        console.log("Queue vidée avec succès");
        
        // Trouver l'index de la chanson sélectionnée
        const startIndex = this.songs.indexOf(selectedSong);
        if (startIndex === -1) {
          console.error("Chanson non trouvée dans l'album");
          return;
        }
        
        // Réorganiser les chansons pour commencer par celle sélectionnée
        // et ensuite ajouter toutes les autres
        const songsInOrder = [
          ...this.songs.slice(startIndex),
          ...this.songs.slice(0, startIndex)
        ];
        
        // Ajouter la première chanson et la jouer immédiatement
        this.queueService.addToQueue(usuario, songsInOrder[0].id_cancion).subscribe({
          next: () => {
            console.log("Première chanson ajoutée, chargement et lecture...");
            // Ceci va charger et jouer la chanson en position 0
            this.playerService.loadSongByPosition(0);
            
            // Ajouter le reste des chansons séquentiellement
            let completed = 0;
            const total = songsInOrder.length - 1;
            
            // Ne rien faire s'il n'y a pas d'autres chansons
            if (total === 0) return;
            
            // Ajouter chaque chanson restante une par une
            for (let i = 1; i < songsInOrder.length; i++) {
              this.queueService.addToQueue(usuario, songsInOrder[i].id_cancion).subscribe({
                next: () => {
                  completed++;
                  console.log(`Chanson ${i} ajoutée, ${completed}/${total} complétées`);
                  
                  // Une fois toutes les chansons ajoutées, mettre à jour la queue
                  if (completed === total) {
                    console.log("Toutes les chansons ajoutées, mise à jour de la queue");
                    this.playerService.getQueue(usuario);
                  }
                },
                error: (err) => console.error(`Erreur lors de l'ajout de la chanson ${i}:`, err)
              });
            }
          },
          error: (err) => console.error("Erreur lors de l'ajout de la première chanson:", err)
        });
      },
      error: (err) => console.error("Erreur lors du vidage de la queue:", err)
    });
  }
  
  


  playAlbum() {
    console.log("playAlbum appelé");
     
    if (this.isPlaying){
      console.log("mettre en pause");
      this.playerService.togglePlay();
       
    }
    else {
      console.log("Démarrage de l'album");
       
      // Si on n'est pas en lecture, mettre isPlaying à true immédiatement pour feedback visuel
      if (!this.isPlaying) {
        this.isPlaying = true;
        this.cdRef.detectChanges();
      }
       
      const usuario = this.usuarioService.getUsuario()?.nombre_usuario;
       
      // Vider la queue et ajouter l'album
      this.queueService.clearQueue(usuario).subscribe(() => {
        // Ajouter la première chanson
        this.queueService.addToQueue(usuario, this.songs[0].id_cancion).subscribe(() => {
          // Démarrer la lecture
          this.playerService.loadSongByPosition(0);
           
          // Ajouter les autres chansons
          for (let i = 1; i < this.songs.length; i++) {
            this.queueService.addToQueue(usuario, this.songs[i].id_cancion).subscribe();
          }
        });
      });
    }
  }
  
  isOpen = false;
  isOpen_option = false;
  
  @ViewChild('popup') popupRef!: ElementRef;
  @ViewChild('popup2') popupRef2!: ElementRef;
  @ViewChild('popup3') popupRef3!: ElementRef;
  
  
  isOpen_cancion = false;

  choices:any = [];
  playlists: any = [];
  
  showNewListInput = false; 
  newListName = "";
  
   color = "#A200F4";
   typo = "canciones";
   songToAdd:any = null;


   @HostListener('document:mousedown', ['$event'])
  handleClickOutside(event: Event) {
    if (this.isOpen && this.popupRef && !this.popupRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
    if (this.isOpen_cancion && this.popupRef2 && !this.popupRef2.nativeElement.contains(event.target)) {
      this.isOpen_cancion = false;
    }
    if (this.isOpen_option && this.popupRef3 && !this.popupRef3.nativeElement.contains(event.target)) {
      this.isOpen_option = false;
    }
  }

  openPopup(event?: MouseEvent) {
    if (!event) return;
    this.isOpen = true;
    
  }

  openPopup2(event: MouseEvent,  song?:any): void {
   
    this.isOpen_cancion = true;
    this.toggleBox('cancion',song);

    
  }

  openPopup3(event: MouseEvent,  song?:any): void {
   
    this.isOpen_option = true;
    

    
  }

  closePopup() {
    this.isOpen = false;
  }

  closePopup2() {
    this.isOpen_cancion = false;
  }

  closePopup3() {
    this.isOpen_option = false;
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
  this.isOpen_option = !this.isOpen_option;
  this.songToAdd = song;
 }
    


  

  toggleBox(typo:string, song?:any) {
    if (typo == "album"){
      this.isOpen = !this.isOpen;
    }
    if (typo == "cancion"){
      this.isOpen_cancion = !this.isOpen_cancion;
      this.songToAdd = song;
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
   
    

      this.authService.createPlaylist(this.newListName, this.nombre_usuario, this.color, this.typo).subscribe({
        
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
         
              }  
      })},
        error: (err) => console.error("Error lista no creada:", err)
      });
    }
  
  console.log("Playlists selected :", selectedPlaylists);
  console.log("usuario :", this.nombre_usuario);
  for(let selectedPlaylist of selectedPlaylists){
    for (let cancion of this.songs){
      
      console.log("cancion:", cancion);
      
       this.addSongToPlaylist(cancion, selectedPlaylist);

  }

}
  }

  validateSelection_cancion() {
    this.isOpen_cancion = false
    const selectedPlaylists = this.choices
    .filter((choice: PlaylistChoice) => choice.selected && choice.name !== "Crear nueva lista")
    .map((choice: PlaylistChoice) => ({
      name: choice.name,
      id: choice.id
    }));
  if (this.showNewListInput && this.newListName.trim() !== "") {
   
    

    this.authService.createPlaylist(this.newListName, this.nombre_usuario, this.color, this.typo).subscribe({
      
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
       
            }  
    })},
        error: (err) => console.error("Error lista no creada:", err)
      });
    }
  
  console.log("Playlists selected :", selectedPlaylists);
  console.log("usuario :", this.nombre_usuario);
  for(let selectedPlaylist of selectedPlaylists){
      console.log("cancion:", this.songToAdd);
      console.log("selectedPlaylist:", selectedPlaylist);
       this.addSongToPlaylist(this.songToAdd, selectedPlaylist);

  

}
  }


addSongToPlaylist(song:any,playlist: any) {
  console.log("song.id_cm:", song.id_cancion);
  console.log(" playlist.id_lista", playlist.id);
  this.authService.addSongToPlaylist(song.id_cancion, playlist.id).subscribe({
    next: () => {  // No necesitamos la respuesta si no la vamos a usar
      // Mostrar alerta con el mensaje de éxito
      alert('cancion anadida en la playlist');
      
     
    },
    error: (error) => {
      // Mostrar alerta con el mensaje de error
      alert('Error al añadir la canción a la playlist');
      console.error('Error al añadir la canción:', error);
    }
  });
}

togglePlaylistPopup(){
  this.isOpen_cancion = !this.isOpen_cancion;
  this.nombre_usuario = this.usuarioService.getUsuario();
  
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

anadirCola(){
  console.log("anadir a la cola");
  this.nombre_usuario = this.usuarioService.getUsuario().nombre_usuario;
  
  if (!this.nombre_usuario) {
    console.warn("Usuario no conectado. Error recuperación listas.");
    return;
  }
  this.queueService.addToQueue(this.nombre_usuario,this.songToAdd.id_cancion ).subscribe({
    next: () => {  
    
      alert('cancion anadida en la queue');
      
     
    },
    error: (error) => {
     
      alert('Error al añadir la canción a la playlist');
      console.error('Error al añadir la canción:', error);
    }
  });

  this.isOpen_option = !this.isOpen_option;
}

}







