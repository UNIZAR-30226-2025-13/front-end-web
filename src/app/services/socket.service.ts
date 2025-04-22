// socket.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { io, Socket } from 'socket.io-client';
import { UsuarioService } from './usuario.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class SocketService {
  public socket: Socket;
  

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private authService: AuthService
  ) {
    this.socket = io('https://spongefy-back-end.onrender.com', {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    // Solo una vez al principio:
    this.socket.on('connect', () => {
      console.log('✅ Socket conectado:', this.socket.id);
    });

    this.socket.on('forceLogout', () => {
      console.warn('⚠️ Sesión iniciada en otro dispositivo');
      alert('Has sido desconectado');
      this.router.navigate(['/login']);
      this.disconnect();
      this.reconnect();
    });
  }

  // Métodos para emitir desde otros componentes
  login(nombre_usuario: string) {
    this.socket.emit('login', nombre_usuario);
  }

  // Método para desconectar el socket manualmente
  disconnect() {
    this.socket.disconnect();
    console.log('Socket desconectado');
  }

  // Método para reconectar el socket manualmente
  reconnect() {
    this.socket.connect();
    console.log('Intentando reconectar el socket');
  }

}
