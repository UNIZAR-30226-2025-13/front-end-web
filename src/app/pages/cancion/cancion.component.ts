import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule} from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterModule, Router } from '@angular/router'

import { PlayerService } from '../../services/player.service';

// @ts-ignore
import ColorThief from 'colorthief';
import { UsuarioService } from '../../services/usuario.service';
import { QueueService } from '../../services/queue.service';

@Component({
  selector: 'app-cancion',
  imports: [CommonModule, RouterModule],
  template: `
  <div class="bg-black pt-4 px-[34px] h-full">
    <!-- upper box -->
    <div class="flex bg-opacity-60 p-4 rounded-[40px] items-end" [ngStyle]="{'background-color': dominantColor}">
      <div class="flex-row  items-center justify-center">
        <div class="flex flex-row items-center justify-center space-x-4"> <!-- flex-row pour aligner horizontalement -->
          <img [src]="song.link_imagen" alt="Imagen de la cancion" id="cancionImage" class=" rounded-[20px] h-[200px] w-[200px] flex items-center justify-center">
          <!-- lista information-->
          <div class="flex flex-col items-start pt-20 text-white">
            <p class="">Canción</p>
            <h1 class="font-montserrat font-bold text-4xl ml-[-2px] text-white">{{ song.titulo }}</h1>
            <div class="flex flex-row w-full overflow-hidden whitespace-nowrap ">
              <p class=" cursor-pointer min-w-fill max-w-full " [routerLink]="['/inicio/artista/', encodeNombreArtista(song.autor)]">{{song.autor}}</p>
              <ng-container *ngIf="song.artistas_featuring != null">
                <ng-container *ngFor="let ft of getArtistasFeat(song); track by ft">
                  <p class="inline-block min-w-max">,&nbsp;</p>
                  <p [routerLink]="['/inicio/artista/', encodeNombreArtista(ft)]" 
                    class="cursor-pointer inline-block min-w-max">
                    {{ ft }}
                  </p>
                </ng-container>
              </ng-container>
              <p>&nbsp;| {{ano}} </p>
            </div>
          </div>
        </div>
        <div class=" flex mt-4 gap-1.5">
          <img src="assets/play.png" alt="play" (click)="addSongToQueue(song)" class=" h-[52px] w-[52px]">
          <img src="assets/anyadirplaylist.png" alt="anadir" (click)="add()" class=" h-[52px] w-[52px]">
        </div>
      </div>
    </div>
    <!-- valorcaion  -->
    <div class="flex  items-center gap-8 m-4 mr-20">
      <!-- Section Tu valoración -->
      <div class="flex flex-col items-start">
          <p class="font-montserrat text-lg text-white text-center">Tu valoración</p>
          <div class="flex w-[calc(48px * 5)] mt-1">
              <img *ngFor="let star of generateStars(this.valoration)" [src]="star" alt="star" class="w-12 h-auto flex-col"/>
              <script src="script.js"></script>
          </div>
      </div>

      <!-- Section valoración media -->
      <div class="flex flex-col items-start m-4 ml-20">
          <p class="font-montserrat text-lg text-white text-center">Valoración media</p>
          <div class="flex w-[calc(48px * 5)] mt-1">
              <img *ngFor="let star of generateStars(this.valoration_media)" [src]="star" alt="star" class="w-12 h-auto flex-col"/>
              <script src="script.js"></script>
          </div>
      </div>
    </div>

    <!-- song  -->
    <div class="grid grid-cols-12 gap-4 text-left text-white">
        <div class="  ml-4 col-span-6 ">Título</div>
        <div class=" col-span-4 ">Reproduciones</div>
        <div class=" col-span-1">Duracion</div>
    </div>
    <hr class="border-t-2 border-white my-2">  
    <div class="grid grid-cols-12 gap-4 group ml-4 text-white items-center rounded-[10px] transition-transform duration-300 hover:scale-101" (dblclick)="addSongToQueue(song)">   
      <div class="flex m-2 ml-0 col-span-6">
        <div class="relative w-[44px] h-[44px] mr-1 min-w-[44px]" (click)="addSongToQueue(song)">                
            <!-- Capa oscura con icono de Play -->
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[10px]">
                <img src="assets/play.png" alt="Play"
                    class="w-6 h-6 cursor-pointer">
            </div>
        </div> 
        <div class="flex flex-col">
          <p class="font-montserrat font-bold text-lg text-white">
              {{ song.titulo  }}
          </p>
          <div class="flex flex-row w-full overflow-hidden whitespace-nowrap ">
              <p class="text-white text-sm hover:underline min-w-fill max-w-full " [routerLink]="['/inicio/artista/', encodeNombreArtista(song.autor)]">{{song.autor}}</p>
              <ng-container *ngIf="song.artistas_featuring != null">
                <ng-container *ngFor="let ft of getArtistasFeat(song); track by ft">
                  <p class="text-white text-sm inline-block min-w-max">,&nbsp;</p>
                  <p [routerLink]="['/inicio/artista/', encodeNombreArtista(ft)]" 
                    class="text-white text-sm hover:underline inline-block min-w-max">
                    {{ ft }}
                  </p>
                </ng-container>
              </ng-container>
          </div>
        </div>
      </div>
      <div class="col-span-4">{{ song.reproducciones | number:'1.0-0':'es-ES' }}</div>
      <div class="col-span-1">{{ formatDurationSong(song.duracion) }}</div>
      <div class=" flex items-center space-x-3   col-span-1 justify-right ">
          <img src="assets/anyadirplaylist.png" alt="anadir" (click)="add()" class=" h-[17px] w-[18px]">
          <img src="assets/heart.png" alt="like" (click)="like()" class=" h-[17px] w-[18px]">
      </div>
    </div>
    <hr class="border-t-2 border-white my-4">  
    <p class="font-montserrat  text-l text-white ml-4"> {{ formatFecha(song.fecha_pub) }}</p>
  </div>  
  `,
})
export class CancionComponent implements OnInit, AfterViewInit {
  
  constructor(
    private authService: AuthService,
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router,
    private playerService: PlayerService,
    private userService: UsuarioService,
    private queueService: QueueService
  ) {}
  
  dominantColor: string = 'rgba(0, 70, 50 , 4)'; //TODO
 

  song: any;
  id_cancion: string = '';
  ano: string = '';
  artista: string = '';
  valoration_media: string = '0';
  valoration: string = '0';



  ngOnInit() {
    this.id_cancion = this.route.snapshot.paramMap.get('id_cancion') ?? '';
    this.authService.showSong(parseInt(this.id_cancion)).subscribe((data) => {
      this.song = data;
      console.log(this.song);
      this.titleService.setTitle(this.song.titulo + ' - ' + this.song.autor);
      this.artista = this.song.autor;
      this.ano = this.formatAno(this.song.fecha_pub);

      // Extraire la couleur dominante
      const imgElement = document.getElementById('cancionImage') as HTMLImageElement;
      if (imgElement) {
        imgElement.crossOrigin = 'anonymous'; // Evita errores CORS
        if (imgElement.complete) {
          this.extractColor(imgElement);
        } else {
          imgElement.onload = () => this.extractColor(imgElement);
        }
      }

      this.authService.getRate(parseInt(this.id_cancion), this.userService.getUsuario()?.nombre_usuario).subscribe((data) => {
        this.valoration = data.valoracion;
        this.authService.getAverageRate(parseInt(this.id_cancion)).subscribe((data) => {
          this.valoration_media = data.valoracion;
        });
      });
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const imgElement = document.getElementById('cancionImage') as HTMLImageElement;
      if (imgElement && imgElement.naturalWidth > 0) {
        this.extractColor(imgElement);
      } else {
        console.warn('La imagen aún no está lista, intentándolo de nuevo...');
      }
    }, 1000);
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

  //to play the first song of the playlist
  playSong(){} //TODO
  //to put in aleatorio mode
  random(){} //TODO
  //to anadir
  add(){}//TODO
  option(){}//TODO
  like(){}//TODO


  generateStars(rating: string): string[] {
    const r = parseFloat(rating);
    const stars = [];
    const fullStars = Math.floor(r);
    const hasHalfStar = r % 1 >= 0.5;
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

  addSongToQueue(selectedSong: any) {
    const usuario = this.userService.getUsuario()?.nombre_usuario;
    console.log('Cancion seleccionada:', selectedSong);
    this.queueService.clearQueue(this.userService.getUsuario()?.nombre_usuario).subscribe(() => {
    });
    
    if (!usuario || !selectedSong) return;
  
    // Añadir solo la canción seleccionada a la cola
    this.queueService.addToQueue(usuario, selectedSong.id_cancion).subscribe({
      next: () => {
        // Cargar la canción seleccionada inmediatamente
        this.playerService.loadSongByPosition(0);
        this.playerService.getQueue(usuario);
        console.log('Canción añadida a la cola.');
      },
      error: (err: any) => {
        console.error('Error al añadir la canción a la cola:', err);
      },
    });
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

  getArtistasFeat(song: any): string[] {
    return song.artistas_featuring ? song.artistas_featuring.split(',').map((artista: string) => artista.trim()) : [];
  }

  encodeNombreArtista(nombre: string): string {
    return encodeURIComponent(nombre);
  }
}

