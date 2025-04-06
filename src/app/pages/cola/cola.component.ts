import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { QueueService } from '../../services/queue.service';
import { UsuarioService } from '../../services/usuario.service';
import { PlayerComponent } from '../player/player.component';
import { PlayerService } from '../../services/player.service';
@Component({
  selector: 'app-cola',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="w-100 h-full bg-[var(--graybackground)] rounded-l-2xl p-4 flex flex-col">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-white">Cola de reproducción</h1>
        <button 
        (click)="borrarCola()"
        class="flex flex-row text-[10px] gap-1 items-center bg-red-600 hover:bg-red-800 text-white font-bold py-1 px-2 rounded-lg transition-transform duration-200 hover:scale-110"
      >
        <img src="assets/trash.png" class="w-3 h-3"> Borrar
      </button>
      </div>
      
        <h1 class="text-lg font-bold text-white pt-2 mb-2">Sonando</h1>
        <div *ngFor="let cm of contenido.slice(0,1)" class="bg-[var(--sponge)]/50 px-3 w-full flex flex-col text-white items-center hover:bg-[var(--sponge)]/70 rounded-[10px] transition-transform ">
          <div class="flex m-2 col-span-6 w-full">
            <div class="relative w-[44px] h-[44px] group mr-5 min-w-[44px]">
              <img [src]="cm.link_imagen" alt="Icono de la canción" class="w-full h-full rounded-[10px] object-cover flex-shrink-0">
            </div>
            <div class="flex flex-col w-full overflow-hidden text-ellipsis truncate whitespace-nowrap">
              <p class="font-montserrat font-bold text-lg  line-clamp-1 text-white">{{ cm.titulo }}</p>
              <div class="flex flex-row">
                <span class="text-white text-sm hover:underline text-ellipsis" [routerLink]="['/inicio/artista/', encodeNombreArtista(cm.artista)]">{{ cm.artista }}</span>
                <ng-container *ngIf="cm.featurings != null">
                  <ng-container *ngFor="let ft of cm.featurings; track by ft">
                    <span class="text-white text-sm inline-block min-w-max">,&nbsp;</span>
                    <span [routerLink]="['/inicio/artista/', encodeNombreArtista(ft)]" class="text-white text-sm hover:underline inline-block min-w-max">{{ ft }}</span>
                  </ng-container>
                </ng-container>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-1 overflow-y-auto scrollbar-hide py-2">
        <h1 class="text-lg font-bold text-white mb-2">Siguiente</h1>
        <div *ngFor="let cm of contenido.slice(1)" class="px-3 w-full flex flex-col text-white items-center hover:bg-gray-500/20 rounded-[10px] transition-transform ">
          <div class="flex m-2 col-span-6 w-full">
            <div class="relative w-[44px] h-[44px] group mr-5 min-w-[44px]">
              <img [src]="cm.link_imagen" alt="Icono de la canción" class="w-full h-full rounded-[10px] object-cover flex-shrink-0">
            </div>
            <div class="flex flex-col w-full overflow-hidden text-ellipsis truncate whitespace-nowrap">
              <p class="font-montserrat font-bold text-lg  line-clamp-1 text-white">{{ cm.titulo }}</p>
              <div class="flex flex-row">
                <span class="text-white text-sm hover:underline text-ellipsis" [routerLink]="['/inicio/artista/', encodeNombreArtista(cm.artista)]">{{ cm.artista }}</span>
                <ng-container *ngIf="cm.featurings != null">
                  <ng-container *ngFor="let ft of cm.featurings; track by ft">
                    <span class="text-white text-sm inline-block min-w-max">,&nbsp;</span>
                    <span [routerLink]="['/inicio/artista/', encodeNombreArtista(ft)]" class="text-white text-sm hover:underline inline-block min-w-max">{{ ft }}</span>
                  </ng-container>
                </ng-container>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ColaComponent {

  constructor (
    public queueService: QueueService,
    public userService: UsuarioService,
    public playerService: PlayerService
  ) {}
  
  contenido: any;
  
  ngOnInit() {
    this.playerService.currentQueue.subscribe(currentQueue => {
      if (currentQueue) {
        this.contenido = currentQueue.cola;
        console.log('Cola actual:', this.contenido);
      } else {
        this.contenido = [];
      }
    });
  }

  playSong(cm: any) {
    console.log('Reproduciendo:', cm.nombre_contenido);
  }
  
  encodeNombreArtista(nombre: string): string {
    return encodeURIComponent(nombre);
  }

  borrarCola() {
    this.playerService.clearQueue(this.userService.getUsuario()?.nombre_usuario)
  }
}