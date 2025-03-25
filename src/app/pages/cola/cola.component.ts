import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

@Component({
  selector: 'app-cola',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="w-80 h-full bg-[var(--graybackground)] rounded-l-2xl p-4">
      <div *ngFor="let cm of contenido" class="grid grid-cols-20 gap-4 text-white items-center hover:bg-gray-500/20 rounded-[10px] transition-transform duration-300 hover:scale-101" (dblclick)="playSong(cm)">
        <div class="flex m-2 col-span-6">
          <div class="relative w-[44px] h-[44px] group mr-5 min-w-[44px]" (click)="playSong(cm)">
            <img [src]="cm.link_imagen" alt="Icono de la canción" class="w-full h-full rounded-[10px] object-cover flex-shrink-0">
            <div class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-[10px]">
              <img src="assets/play.png" alt="Play" class="w-6 h-6 cursor-pointer">
            </div>
          </div>
          <div class="flex flex-col min-w-full">
            <p class="font-montserrat font-bold text-lg text-white">{{ cm.nombre_contenido }}</p>
            <div class="flex flex-row">
              <span class="min-w-full text-white text-sm hover:underline max-w-full" [routerLink]="['/inicio/artista/', encodeNombreArtista(cm.nombre_creador)]">{{ cm.nombre_creador }}</span>
              <ng-container *ngIf="cm.artistas_feat != null">
                <ng-container *ngFor="let ft of cm.artistas_feat; track by ft">
                  <span class="text-white text-sm inline-block min-w-max">,&nbsp;</span>
                  <span [routerLink]="['/inicio/artista/', encodeNombreArtista(ft)]" class="text-white text-sm hover:underline inline-block min-w-max">{{ ft }}</span>
                </ng-container>
              </ng-container>
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
  ) {}
  contenido = [
    {
      link_cm: 'https://example.com/contenido1',
      link_imagen: 'https://example.com/imagen1.jpg',
      nombre_contenido: 'Contenido 1',
      nombre_creador: 'Creador 1',
      artistas_feat: ['Artista A', 'Artista B']
    },
    {
      link_cm: 'https://example.com/contenido2',
      link_imagen: 'https://example.com/imagen2.jpg',
      nombre_contenido: 'Contenido 2',
      nombre_creador: 'Creador 2',
      artistas_feat: ['Artista C', 'Artista D']
    }
  ];
  
  playSong(cm: any) {
    console.log('Reproduciendo:', cm.nombre_contenido);
  }
  
  encodeNombreArtista(nombre: string): string {
    return encodeURIComponent(nombre);
  }
}