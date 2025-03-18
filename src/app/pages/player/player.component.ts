import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../services/player.service';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-player',
  imports: [CommonModule, RouterModule],
  template: `
  <div class="bg-black">
  <div class="flex flex-row bg-[var(--sponge)] w-full h-[90px] rounded-tl-[40px] rounded-tr-[40px] justify-between">
    
    <!-- Parte izquierda -->
    <div class="flex items-center pl-10 flex-1 gap-2">
      <img [src]="currentSong?.link_imagen" class="h-[50px] mr-1.5 rounded-2xl">
      <div class="text-white text-sm">
        <a class="block font-bold">{{ currentSong?.titulo }}</a>
        <div class="w-full max-xl:w-20 overflow-hidden text-ellipsis whitespace-nowrap">
          <ng-container *ngFor="let cantante of cantantes; let i = index">
            <a [routerLink]="['/inicio/artista/', encodeNombreArtista(cantante)]"
              class="text-white hover:underline"
            >{{ cantante }}</a>
            <span *ngIf="i < cantantes.length - 1">,&nbsp;</span>
          </ng-container>
        </div>
      </div>
      <!-- Botón Añadir a Playlist -->
      <div class="relative">
          <img src="assets/anyadirplaylist.png" class="min-w-[25px] h-[25px] cursor-pointer" (click)="togglePlaylistPopup()">
          <!-- Popup de la playlist -->
          <div *ngIf="showPlaylistPopup && currentSong?.link_cm" 
              class="absolute bottom-full left-0 mb-2 bg-black border-1 border-[var(--sponge)] text-white p-2 w-90 max-h-70 max-md:w-70 overflow-auto rounded-[10px] shadow-lg scrollbar-hide">
            <div *ngFor="let playlist of playlists" 
                class="p-1 cursor-pointer hover:underline truncate line-clamp-1"
                (click)="addSongToPlaylist(playlist)">
              {{ playlist.nombre }}
            </div>
          </div>
        </div>
        <img src="assets/fav.png" class="h-[25px]">
    </div>
  
    <!-- Parte central -->
    <div class="flex flex-col justify-center flex-1 items-center max-lg:mr-10">
      <div class="flex flex-row gap-2 max-md:justify-end max-md:items-end max-md:w-full">
        <img class="w-[30px] h-[30px] max-md:hidden" src="assets/aleatorio.png">
        <img class="w-[35px] h-[35px] max-md:hidden" src="assets/atras.png">

        <!-- Botón de play/pause con control de audio -->
        <div 
          class="w-[35px] h-[35px] flex items-center justify-center transition-transform duration-200"
          [style.transform]="isPlaying ? 'rotate(45deg)' : 'rotate(0deg)'"
          (click)="togglePlay()">
          <img 
            class="w-full h-full transition-transform duration-200"
            [src]="isPlaying ? 'assets/pause.png' : 'assets/play.png'">
        </div>

        <img class="w-[35px] h-[35px] max-md:hidden" src="assets/adelante.png">
        <img class="w-[30px] h-[30px] max-md:hidden" src="assets/bucle.png">
      </div>

      <!-- Barra de progreso de la canción -->
      <div class="flex flex-row text-white gap-2 items-center max-md:hidden">
        <a class="w-10">{{ formatTime(currentTime) }}</a> 
        <input 
          type="range" 
          class="custom-slider" 
          min="0" 
          max="100" 
          [value]="(currentTime / duration) * 100" 
          (input)="seekAudio($event)" 
          (change)="finalizarSeek()"
        >

          <a class="w-10">{{ formatTime(duration) }}</a>
      </div>
    </div>

    <!-- Parte derecha -->
<div class="flex flex-row items-center pr-10 flex-1 justify-end max-lg:hidden">
  <img class="w-[30px] h-[30px] mr-2" src="assets/lyrics.png">
  <img class="w-[30px] h-[30px] mr-2" src="assets/queue.png">
  <img class="w-[30px] h-[30px] mr-2" src="assets/sound.png">

  <!-- Slider de volumen -->
  <input 
    type="range" 
    class="custom-volume-slider w-[100px]" 
    min="0" 
    max="1" 
    step="0.01" 
    [value]="volume"
    (input)="changeVolume($event)"
  >
</div>
  </div>

  <!-- Elemento de audio (oculto) con enlace de Cloudinary -->
  <audio #audioPlayer (timeupdate)="updateTime()" (loadedmetadata)="setDuration()">
    <source [src]="currentSong?.link_cm" type="audio/mp3">
  </audio>
</div>

  `,
  styles: `
  .custom-slider {
  -webkit-appearance: none; /* Ocultar el diseño por defecto en navegadores Webkit */
  appearance: none;
  width: 400px;
  height: 6px; /* Grosor de la barra */
  background: linear-gradient(to right, var(--spongedark) var(--progress), #ddd var(--progress));
  ; /* Color dinámico */
  border-radius: 5px;
  outline: none;
  transition: background 0.1s;
  cursor: pointer;
}

/* Personalización del thumb (el botón deslizante) */
.custom-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  background: var(--spongedark); /* Color del thumb */
  border-radius: 50%;
  cursor: pointer;
}

.custom-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: var(--spongedark);
  border-radius: 50%;
  cursor: pointer;
}

.custom-volume-slider {
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  border-radius: 5px;
  outline: none;
  cursor: pointer;
  transition: background 0.2s;
  
  /* Fondo inicial */
  background: linear-gradient(to right, white 100%, rgba(255, 255, 255, 0.4) 100%);
}

/* Personalización del thumb (el punto deslizante) */
.custom-volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
}

.custom-volume-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
}

`
})
export class PlayerComponent implements OnInit {
  @ViewChild('audioPlayer', { static: false }) audioPlayer!: ElementRef<HTMLAudioElement>;

  currentSong: any = null;
  isPlaying = false;
  currentTime = 0;
  duration = 0;
  cantantes: string[] = [];volume = 1;
  playlists = [
    { nombre: 'Favoritos' },
    { nombre: 'Rock Clásico' },
    { nombre: 'Música Chill' },
    { nombre: 'Workout' },
    { nombre: 'Viaje' }
  ];
  showPlaylistPopup = false;

  constructor(
    private playerService: PlayerService,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}
  
  ngOnInit() {
    this.playerService.currentSong.subscribe(song => {
      if (song) {
        this.currentSong = song;
        this.cantantes = [song.autor, ...(song.artistas_featuring ? song.artistas_featuring.split(', ') : [])];
        this.loadAndPlaySong();
      }
    });
  
    if (this.audioPlayer?.nativeElement) {
      this.audioPlayer.nativeElement.onended = () => {
        this.isPlaying = false;
        this.currentTime = 0;
        document.documentElement.style.setProperty('--progress', `0%`);
      };
    }
  }

  changeVolume(event: Event) {
    const input = event.target as HTMLInputElement;
    this.volume = parseFloat(input.value);
  
    if (this.audioPlayer?.nativeElement) {
      this.audioPlayer.nativeElement.volume = this.volume;
    }
  
    // Actualizar el fondo del slider
    const percentage = this.volume * 100;
    input.style.background = `linear-gradient(to right, 
      white ${percentage}%, 
      rgba(255, 255, 255, 0.4) ${percentage}%)`;
  }

  togglePlaylistPopup() {
    if (this.currentSong?.link_cm) {
      this.showPlaylistPopup = !this.showPlaylistPopup;
      
      // Llamar al método de authService para obtener las playlists
      this.authService.getUserPlaylists(this.usuarioService.getUsuario().nombre_usuario).subscribe(
        (response: any) => {
          // Asumimos que la respuesta contiene un array de playlists
          this.playlists = response; // Actualizar las playlists con los datos de la API
        },
        (error) => {
          console.error('Error al obtener las playlists:', error);
        }
      );
    }
  }

  addSongToPlaylist(playlist: any) {
    this.authService.addSongToPlaylist(this.currentSong.id_cancion, playlist.id_lista).subscribe({
      next: () => {  // No necesitamos la respuesta si no la vamos a usar
        // Mostrar alerta con el mensaje de éxito
        alert('Canción añadida correctamente a la playlist');
        
        // Cerrar el popup
        this.showPlaylistPopup = false;
      },
      error: (error) => {
        // Mostrar alerta con el mensaje de error
        alert('Error al añadir la canción a la playlist');
        console.error('Error al añadir la canción:', error);
      }
    });
  }

  loadAndPlaySong() {
    if (this.audioPlayer?.nativeElement && this.currentSong?.link_cm) {
      const audio = this.audioPlayer.nativeElement;
      audio.src = this.currentSong.link_cm;
      audio.load();
      
      audio.oncanplay = () => {
        this.currentTime = 0; 
        this.duration = audio.duration || 0;
        audio.play().then(() => {
          this.isPlaying = true;
        }).catch(err => console.error('Error al reproducir:', err));
      };
    }
  }
  

  togglePlay() {
    if (this.audioPlayer?.nativeElement) {
      const audio = this.audioPlayer.nativeElement;
      if (this.isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(err => console.error('Error al reproducir:', err));
      }
      this.isPlaying = !this.isPlaying;
    }
  }

  updateTime() {
    if (this.audioPlayer?.nativeElement) {
      this.currentTime = this.audioPlayer.nativeElement.currentTime;
  
      let progress = (this.currentTime / this.duration) * 100;
      document.documentElement.style.setProperty('--progress', `${progress}%`);
  
      // Actualizar manualmente el slider para que se vea en tiempo real
      const slider = document.querySelector('.custom-slider') as HTMLInputElement;
      if (slider) {
        slider.value = String(progress);
      }
    }
  }
  
  setDuration() {
    if (this.audioPlayer?.nativeElement) {
      this.duration = this.audioPlayer.nativeElement.duration;
    }
  }

  seekAudio(event: Event) {
    if (this.audioPlayer?.nativeElement) {
      const input = event.target as HTMLInputElement;
      const newTime = (parseFloat(input.value) / 100) * this.duration;
  
      this.audioPlayer.nativeElement.currentTime = newTime;
      this.currentTime = newTime;
  
      // Actualizar visualmente el progreso
      document.documentElement.style.setProperty('--progress', `${input.value}%`);
    }
  }

  finalizarSeek() {
    if (this.audioPlayer?.nativeElement) {
      this.audioPlayer.nativeElement.play().catch(err => console.error('Error al continuar:', err));
      this.isPlaying = true;
    }
  }

  formatTime(seconds: number): string {
    if (!seconds) return '0:00';
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  }

  encodeNombreArtista(nombre: string): string {
    return encodeURIComponent(nombre);
  }
  
}