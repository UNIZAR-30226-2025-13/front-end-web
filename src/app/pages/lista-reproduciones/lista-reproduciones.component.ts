import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-reproduciones',
  imports: [CommonModule],
  templateUrl: './lista-reproduciones.component.html',
})
export class ListaReproducionesComponent implements OnInit {
  id_playlist: string = '';
  playlist: any = null;
  name: string = '';
  color_playlist: string = '';
  canciones: any[] = [];
  playlistNotFound = false;
  durationTotal: string = '';
  numberSong:number = 0;
  visibility: string = 'publica';//TODO

  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private authService: AuthService
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
          this.color_playlist = data.color;
          this.canciones = data.canciones || [];
          this.titleService.setTitle(`${data.nombre} | Spongefy`);
          this.durationTotal = this.calculateDurationTotal(this.canciones);
          this.playlistNotFound = false;
          this.numberSong = this.canciones.length;
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


  calculateDurationTotal(canciones: any[]): string {
    let totalSeconds = 0;
  
    canciones.forEach((cancion) => {
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
  
    
    const formatted = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    console.log('Durée formatée:', formatted); 
    return formatted;
  }
  

  playSong(id_cancion: number) {
    this.authService.playSong(id_cancion).subscribe({
      next: () => {
        console.log(`Lecture de la chanson ${id_cancion} en cours...`);
      },
      error: (err) => {
        console.error('Erreur lors de la lecture de la chanson:', err);
      }
    });
  }

  random(){}//TODO
  add(){}//TODO
  option(){}//TODO
  like(){}//TODO

  generateStars(valoration: number): number[] {
    return new Array(valoration).fill(0); 
  }
}


