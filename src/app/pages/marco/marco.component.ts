import { Component } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { PlayerComponent } from '../player/player.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inicio',
  imports: [HomeComponent, PlayerComponent, RouterModule],
  template: `
    <app-home></app-home>
    <div class="content-area flex-1 flex overflow-auto">
      <section class="dynamic-content flex-1 w-full">
        <router-outlet></router-outlet>
      </section>
    </div>

    <app-player></app-player>
  `,
  styles: `
    :host {
      @apply flex flex-col h-screen overflow-hidden;
    }

    .content-area {
      @apply flex-1 flex overflow-y-auto;
    }

    /* Estilos personalizados para la barra de desplazamiento */
    .content-area::-webkit-scrollbar {
      width: 3px;
    }

    .content-area::-webkit-scrollbar-thumb {
      background-color: #6b7280; /* Gris medio */
      border-radius: 8px;
    }

    .content-area::-webkit-scrollbar-track {
      background: #000000; /* Gris claro */
    }

    .content-area::-webkit-scrollbar-thumb:hover {
      background-color: #4b5563; /* Gris oscuro */
    }
  `
})
export class MarcoComponent {}
