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
    @apply flex flex-col h-screen;
  }
  `
})
export class MarcoComponent {

}
