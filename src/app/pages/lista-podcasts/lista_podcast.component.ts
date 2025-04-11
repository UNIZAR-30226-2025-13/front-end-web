import { Component, OnInit, AfterViewInit, Renderer2, NgZone } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { PlayerService } from '../../services/player.service';
import { UsuarioService } from '../../services/usuario.service';
import { QueueService } from '../../services/queue.service';

// @ts-ignore
import ColorThief from 'colorthief';

@Component({
  selector: 'app-lista-podcasts',
  imports: [CommonModule],
  template: `
  <div class="bg-black pt-4 px-[34px] min-h-screen">

<!-- upper box -->
<div class="flex bg-opacity-60 p-4 rounded-[40px] items-end" [ngStyle]="{'background-color': dominantColor}">
    <div class="flex-row  items-center justify-center ">
        <div class="flex flex-row items-center justify-center space-x-4 ">      
            <img [src]="podcast_icone" id="podcastImage" class=" rounded-[20px] h-[200px] w-[200px] flex items-center justify-center">

            <!-- lista information-->
            <div class="flex flex-col items-start pt-20">
                <p class="text-white">Podcast</p>
                <h1 class="font-montserrat font-bold text-4xl ml-[-2px] text-white">{{ podcast_name }}</h1>
                <p class="text-white">
                <p class="text-white">
                <span *ngFor="let creador of creadores.split(',').slice(0,1)">{{ creador }}</span>
                <span *ngFor="let creador of creadores.split(',').slice(1)">, {{ creador.trim() }}</span>
              </p>
            </div>
        </div>
        <div class=" flex mt-4">
          <img src="assets/play.png" alt="play" (click)="playSong(episodios[0])" class=" h-[52px] w-[52px]">
          <img src="assets/aleatorio.png" alt="aleatorio" (click)="random()" class=" h-[52px] w-[52px]">
          <img src="assets/anyadirplaylist.png" alt="anadir" (click)="add()" class=" h-[52px] w-[52px]">
        </div>
      </div>
    </div>


<div class="m-4">       
<!-- song list -->
<div class="grid grid-cols-16 gap-4 text-left text-white mt-20 items-center">
    <div class="col-span-7">Título</div>
    <div class="col-span-3 text-center">Tu valoración</div>
    <div class="col-span-3 text-center">Valoración Media</div>
    <div class="col-span-2 text-center">Duración</div>
    <div class="col-span-1 text-center"></div>
</div>
<hr class="border-t-2 border-white my-4">  

<div *ngFor="let episodio of episodios" class="grid grid-cols-16 gap-4 text-white items-center rounded-[10px] transition-transform duration-300 hover:scale-101">
    <div class="flex m-3 ml-0 col-span-7">
        <div class="flex flex-col min-w-0 max-w-md">
            <p class="font-montserrat font-bold text-lg text-white line-clamp-1">
                {{ episodio.nombre_ep }}
            </p>
            <p class="text-white text-sm line-clamp-4">
                {{ episodio.descripcion }}
            </p>
        </div>
    </div>
    
    <div class="col-span-3 flex justify-center items-center">
        <img *ngFor="let star of generateStars(episodio.valoracion_del_usuario)" [src]="star" alt="star" class="w-5 h-auto"/>
    </div> 
    
    <div class="col-span-3 flex justify-center items-center">
        <img *ngFor="let star of generateStars(episodio.valoracion_media)" [src]="star" alt="star" class="w-5 h-auto"/>
    </div> 
    
    <div class="col-span-2 flex justify-center items-center">{{ formatDuration(episodio.duracion) }}</div>

    <div class="col-span-1 flex justify-center items-center space-x-2">
        <img src="assets/anyadirplaylist.png" alt="añadir" (click)="add()" class="h-[17px] w-[18px]">
        <img src="assets/heart.png" alt="like" (click)="like()" class="h-[17px] w-[18px]">
        <p (click)="option()" class="font-montserrat font-bold text-xl text-white pb-3">...</p> 
    </div>
</div>

</div>
  `,
})
export class ListaPodcastComponent implements OnInit, AfterViewInit {
    dominantColor: string = 'rgba(75, 85, 99, 0.5)'; //TODO
    podcast_name :string = '';//TODO
    podcast_icone:string ='';//TODO
    creadores: string = '' ;//TODO

    constructor(
        private route: ActivatedRoute,
        private authService: AuthService,
        private titleService: Title,
        private router: Router,
        private playerService: PlayerService,
        private renderer: Renderer2,
        private ngZone: NgZone,
        private userService: UsuarioService,
        private queueService: QueueService
      ) {}
    
    episodios: any

    ngOnInit() {
      this.authService.getPodcast(this.route.snapshot.params['id_podcast'], this.userService.getUsuario()?.nombre_usuario).subscribe((data) => { 
        this.podcast_name = data.podcast.nombre_podcast;
        this.podcast_icone = data.podcast.link_imagen;
        this.creadores = data.creadores.join(", ");
        this.episodios = data.episodios;

        setTimeout(() => {
          const imgElement = document.getElementById('podcastImage') as HTMLImageElement;
          if (imgElement && imgElement.naturalWidth > 0) {
            this.extractColor(imgElement);
          } else {
            console.warn('La imagen aún no está lista, intentándolo de nuevo...');
          }
        }, 1000);
      }
      );
      
      this.titleService.setTitle('Podcast | Spongefy');
    }

    ngAfterViewInit(): void {
      const imgElement = document.getElementById('podcastImage') as HTMLImageElement;
      if (imgElement) {
        imgElement.crossOrigin = 'anonymous'; // Evita errores CORS
        if (imgElement.complete) {
          this.extractColor(imgElement);
        } else {
          imgElement.onload = () => this.extractColor(imgElement);
        }
      }
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
    
    
      // 🔹 Función para convertir RGB a HSL
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
    playSong(song: any){} //TODO
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
  
    sort(){}//TODO

    addSongToQueue(selectedSong: any, event: Event) {
      const usuario = this.userService.getUsuario()?.nombre_usuario;
      event.stopPropagation();
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

    formatDuration(duration: string): string {
      const parts = duration.split(':');
      return parts.length === 3 && parts[0] === '00' ? `${parts[1]}:${parts[2]}` : duration;
    }
  

}
