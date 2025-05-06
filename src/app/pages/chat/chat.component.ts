import { Component, OnInit, OnDestroy, ChangeDetectorRef,Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io } from 'socket.io-client';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { PlayerService } from '../../services/player.service';
import { ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { SocketService } from '../../services/socket.service';


@Component({
  selector: 'app-chat',
  imports: [CommonModule,RouterModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})

export class ChatComponent implements AfterViewChecked  {
  @Input() msg: any;

  text: any[] = [];
  nombreUsuario: any = null;
  nombreUsuarioRecibe: any = null;
  
  misAmigos: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private titleService: Title,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private router: Router,
    private playerService: PlayerService,
    private cdRef: ChangeDetectorRef,
    private socket: SocketService
  ) {}

  ngOnInit() {
    const usuarioLogueado = this.usuarioService.getUsuario();
    console.log('Usuario logueado:', usuarioLogueado.nombre_usuario);
    this.nombreUsuario = usuarioLogueado ? usuarioLogueado.nombre_usuario : 'Usuario desconocido';
    
    this.authService.getFriendsList(usuarioLogueado.nombre_usuario)
    .subscribe({
      next: (response: any) => {
        this.misAmigos = response.amigos || []; 
        console.log('Lista de amigos:', this.misAmigos);
      },
      error: (err) => {
        console.error('Error al obtener la lista de amigos:', err);
      }
    });

    this.socket.onNewMessage((msg) => {
      console.log('Nuevo mensaje recibido:', msg);
      this.cargarMensajes(this.nombreUsuarioRecibe);
      
    });
      
    this.socket.onMessageSent((msg) => {
      this.cargarMensajes(this.nombreUsuarioRecibe);
      
    });
    

    this.socket.onForceLogout(() => {
      alert('Sesión cerrada en otro dispositivo');
      this.router.navigate(['/inicio']);
    });

    this.socket.onMessageDeleted(({ id_mensaje }) => {
      this.cargarMensajes(this.nombreUsuarioRecibe);
    });
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }

  abrirChat(amigo: string) {
    this.nombreUsuarioRecibe = amigo;
    this.cargarMensajes(amigo);
  }

  cargarMensajes(amigo: string) {
    this.authService.getMessages(this.nombreUsuario, amigo).subscribe(
      (data: any[]) => {
        this.text = data.reverse().map(msg => ({
          persona: msg.nombre_usuario_envia === this.nombreUsuario ? 1 : 2,
          texto: msg.contenido,
          typo: 'mensaje',
          id: msg.id_mensaje
        }));
      }
    );
  }
  

  eliminarMensaje(id_mensaje: string) {
      this.socket.deleteMessage(id_mensaje);
  }
  

  enviarMensaje(mensaje: string) {
    if (!mensaje.trim()) return;
  
    const payload = {
      nombre_usuario_envia: this.nombreUsuario,
      nombre_usuario_recibe: this.nombreUsuarioRecibe,
      mensaje: mensaje,
    };
    console.log('Enviando mensaje:', payload);

    this.socket.sendMessage({
      nombre_usuario_envia: this.nombreUsuario,
      nombre_usuario_recibe: this.nombreUsuarioRecibe,
      mensaje: mensaje,
    });

    // Limpia el campo de entrada
    const input = document.querySelector<HTMLInputElement>('input[placeholder="Escribe un mensaje..."]');
    if (input) input.value = '';

  }
  

  generarId(): string {
    return Date.now().toString(); 
  }


  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  ngAfterViewChecked() {
    this.scrollToBottom();
  }
    
  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Erreur de défilement:', err);
    }
  }


}

   

    
      
      
    
    

