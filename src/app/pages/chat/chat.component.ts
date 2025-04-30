import { Component, OnInit, ChangeDetectorRef,Input } from '@angular/core';
 
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { PlayerService } from '../../services/player.service';
import { ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';


@Component({
  selector: 'app-chat',
  imports: [CommonModule,RouterModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements AfterViewChecked  {
  @Input() msg: any;
  
  misAmigos: any[] = [];
  nombre_amigo: string = 'jorgehache';

  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private router: Router,
    private playerService: PlayerService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const usuarioLogueado = this.usuarioService.getUsuario();
    console.log('Usuario logueado:', usuarioLogueado.nombre_usuario);

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
  }

      
  text: any[] = [
    { persona: 2, typo: "mensaje", texto: "me encanta!" },
    { persona: 1, typo: "mensaje", texto: "me encanta!" },
    { persona: 2, typo: "cancion", id: 4 },
    { persona: 2, typo: "cancion", id: 4 },
    { persona: 2, typo: "cancion", id: 4 }
  ];
  info_cancion: any = [];
  cancionNotFound: boolean = false; // Ajout de cette propriété pour gérer l'erreur

    
  ecrire() {}

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
    
  getCancionInfo(id: number) {
    /*
    this.authService.getInfocancion(id).subscribe({
      next: (data) => {
        console.log('datas', data);
        if (data) {
          this.info_cancion = data;
          this.cancionNotFound = false; // Réinitialisation en cas de succès
        } else {
          this.cancionNotFound = true; // Si aucune donnée n'est retournée
        }
        this.cdRef.detectChanges(); // Force la mise à jour de l'affichage
      },
      error: (err) => {
        console.error('fail to charge cancion datas:', err);
        this.cancionNotFound = true; // Gestion des erreurs
        this.cdRef.detectChanges();

      }
  )}, */

    this.info_cancion = {link_imagen: "./assets/exemple_song_2.png", autor: "Harry Styles", artistas_featuring:"", titulo:"Golden (Fine Line) Harry Styles"}
    console.log('info_cancion', this.info_cancion);
  }
    }

   

    
      
      
    
    

