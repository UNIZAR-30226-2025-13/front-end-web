import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  public socket: Socket;


  constructor(
    private router: Router,
  ) {
    this.socket = io('https://spongefy-back-end.onrender.com', { 
      transports: ["websocket","polling"],
      withCredentials: true,
    }); 

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

  login(nombre_usuario: string) {
    this.socket.emit('login', nombre_usuario);
  }

  // Método para reconectar el socket manualmente
  reconnect() {
    this.socket.connect();
    console.log('Intentando reconectar el socket');
  }

  disconnect() {
    this.socket.disconnect();
  }

  sendMessage(data: { nombre_usuario_envia: string, nombre_usuario_recibe: string, mensaje: string }) {
    this.socket.emit('sendMessage', data);
  }

  onNewMessage(callback: (msg: any) => void) {
    this.socket.on('newMessage', callback);
  }

  onMessageSent(callback: (msg: any) => void) {
    this.socket.on('messageSent', callback);
  }

  onForceLogout(callback: () => void) {
    this.socket.on('forceLogout', callback);
  }

  onMessageDeleted(callback: (data: { id_mensaje: string }) => void) {
    this.socket.on('messageDeleted', callback);
  }

  deleteMessage(id_mensaje: string) {
    this.socket.emit('deleteMessage', { id_mensaje });
  }
  
}
