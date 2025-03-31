import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { QueueService } from './queue.service';
import { UsuarioService } from './usuario.service';  // Asegúrate de importar tu servicio de usuario

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private currentSongSubject = new BehaviorSubject<any>(null);
  currentSong = this.currentSongSubject.asObservable();
  private posicionActual: number = 0;  // Guardamos la posición actual de la cola
  private queueSubject = new BehaviorSubject<any>(null);
  currentQueue = this.queueSubject.asObservable();

  constructor(
    private queueService: QueueService, 
    private usuarioService: UsuarioService  // Asegúrate de inyectar el servicio de usuario
  ) {}

  // Método para reproducir una canción dada
  playSong(song: any) {
    console.log(song);
    this.currentSongSubject.next(song);  // Actualiza la canción actual
  }

  // Método para cargar una canción de la cola por su posición
  loadSongByPosition(position: number) {
    if (position >= 0) {
      // Obtienes la canción de la cola según la posición
      this.queueService.getCurrentMedia(this.usuarioService.getUsuario()?.nombre_usuario, position).subscribe(response => {
        console.log('Canción obtenida:', response);
        this.queueService.playCm(response.id_cm).subscribe(response2 => {
          if (response2) {
            console.log(response2)
            this.currentSongSubject.next(response2);
            
            // También actualizamos la posición actual en el servicio
            this.posicionActual = position;
            this.getQueue(this.usuarioService.getUsuario()?.nombre_usuario);
          }
        });
      });
    }
  }

  getQueue(nombre_usuario: string) {
    this.queueService.getQueue(nombre_usuario, this.posicionActual).subscribe(response => {
      this.queueSubject.next(response); // Assuming response is of type string[]
    });
    
  }

  nextSong(loop: boolean) {
    if (loop) {
      this.loadSongByPosition(this.posicionActual);
    } else {
      this.posicionActual++;
      this.loadSongByPosition(this.posicionActual);
    }
    this.getQueue(this.usuarioService.getUsuario()?.nombre_usuario);
  }

  /** 🔹 Retrocede a la canción anterior en la cola */
  previousSong() {
    if (this.posicionActual > 0) {
      this.posicionActual--;
      this.loadSongByPosition(this.posicionActual);
      this.getQueue(this.usuarioService.getUsuario()?.nombre_usuario);
    }
  }

  clearQueue(nombre_usuario: string) {
    this.queueService.clearQueue(nombre_usuario).subscribe(() => {
      console.log('Cola de reproducción borrada');
      this.queueSubject.next(null); // Reinicia la cola
      this.currentSongSubject.next(null); // Reinicia la canción actual
      this.posicionActual = 0; // Reinicia la posición actual
    });
  }
}
