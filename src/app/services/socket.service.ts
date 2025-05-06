import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';


@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:8080', { transports: ["websocket"] }); 

    
    
  }

  login(nombre_usuario: string) {
    this.socket.on('connect', () => {
      console.log('✅ Socket conectado:', this.socket.id);
      this.socket.emit('login', nombre_usuario);

    });
    console.log('Conectando al socket con el nombre de usuario:', nombre_usuario);
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
