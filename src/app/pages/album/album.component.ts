import { Component, OnInit, AfterViewInit, ChangeDetectorRef  } from '@angular/core';
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

@Component({
  
  selector: 'app-album',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './album.component.html',
  styleUrl: './album.component.css'
})
export class AlbumComponent implements OnInit, AfterViewInit {

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
  nombre_usuario:string = '';
   
  //to anadir
  add(){}//TODO
  option(){}//TODO
 
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
          
          // On s'assure que la réponse contient des chansons
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
    this.nombre_usuario = this.usuarioService.getUsuario();
  
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
    // Récupérer le nom de l'utilisateur depuis le service
    this.nombre_usuario = this.usuarioService.getUsuario();
  
    // Vérifier si l'utilisateur est connecté
    if (!this.nombre_usuario) {
      console.warn("Aucun utilisateur connecté, impossible d'ajouter aux favoris.");
      return;
    }
  
    // Vérifier si l'ID de la chanson est valide
    if (!id_cm || isNaN(id_cm)) {
      console.error("ID de chanson invalide.");
      return;
    }
  
    // Appel au service d'authentification pour ajouter aux favoris
    this.authService.addToFav(id_cm, this.nombre_usuario).subscribe({
      next: (response: any) => {
      },
      error: (err) => {
        console.error("Erreur lors de l'ajout aux favoris :", err);
      }
    });
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
}
