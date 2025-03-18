import { Component } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { PlayerComponent } from '../player/player.component';
import { BibliotecaComponent } from '../biblioteca/biblioteca.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [HomeComponent, PlayerComponent, BibliotecaComponent, RouterModule],
  template: `
    <div class="flex flex-col h-screen">
  <!-- Barra superior fija -->
  <header class="h-auto bg-gray-900 text-white">
    <app-home/>
  </header>

  <!-- Área central flexible -->
  <div class="flex flex-1 overflow-hidden bg-black">
    <!-- Biblioteca redimensionable -->
    <app-biblioteca class="flex-shrink-0 py-3.5"/>

    <!-- Contenido principal -->
    <main class="flex-1 overflow-auto scrollbar-hide">
    <section class="flex-1 overflow-auto scrollbar-hide">
        <router-outlet></router-outlet>
      </section>
    </main>
  </div>

  <!-- Reproductor fijo en la parte inferior -->
  <footer class="h-auto bg-gray-900 text-white">
    <app-player/>
  </footer>
</div>

  `,
  styles: [
    `
      :host {
        @apply flex flex-col h-screen;
      }
    `,
  ],
})
export class MarcoComponent {}
