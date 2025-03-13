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
  visibility: string = '';//TODO

  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.id_playlist = this.route.snapshot.paramMap.get('id_playlist') ?? '';

    if (this.id_playlist) {
      this.getPlaylistData(this.id_playlist);
    }
  }

  getPlaylistData(id_playlist: string) {
    this.authService.getPlaylistData(id_playlist).subscribe({
      next: (data) => {
        if (data) {
          this.playlist = data;
          this.name = data.name;
          this.color_playlist = data.color;
          this.canciones = data.canciones || [];
          this.titleService.setTitle(`${data.nombre} | Spongefy`);
          this.durationTotal = this.calculateDurationTotal(this.canciones);
          this.playlistNotFound = false;
          this.numberSong = this.canciones.length
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

  /**
   * Convertit la durée totale de la playlist au format "J h m s".
   */
  calculateDurationTotal(canciones: any[]): string {
    let totalSeconds = 0;

    canciones.forEach((cancion) => {
      const parts = cancion.duracion.split(' ');
      let seconds = 0;

      parts.forEach((part: string) => {
        if (part.includes('h')) {
          seconds += parseInt(part.replace('h', '')) * 3600;
        } else if (part.includes('m')) {
          seconds += parseInt(part.replace('m', '')) * 60;
        } else if (part.includes('s')) {
          seconds += parseInt(part.replace('s', ''));
        } else if (part.includes('J')) {
          seconds += parseInt(part.replace('J', '')) * 86400;
        }
      });

      totalSeconds += seconds;
    });

    return this.formatDuration(totalSeconds);
  }

  /**
   * Formate une durée en secondes en "J h m s".
   */
  formatDuration(totalSeconds: number): string {
    const days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    const houres = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const secondes = totalSeconds % 60;

    let dureeFormatee = '';
    if (days > 0) dureeFormatee += `${days}J `;
    if (houres > 0) dureeFormatee += `${houres}h `;
    if (minutes > 0) dureeFormatee += `${minutes}m `;
    if (secondes > 0) dureeFormatee += `${secondes}s`;

    return dureeFormatee.trim();
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


