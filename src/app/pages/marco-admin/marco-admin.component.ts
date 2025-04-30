import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeAdminComponent } from '../home-admin/home-admin.component';

@Component({
  selector: 'app-marco-admin',
  imports: [RouterModule, CommonModule, HomeAdminComponent],
  template: `
    <div class="flex flex-col h-screen">
      <!-- Barra superior fija -->
      <header class="h-auto bg-gray-900 text-white">
        <app-home-admin/>
      </header>

      <!-- Área central flexible -->
      <main class="flex-1 overflow-auto scrollbar-hide">
      <section class="flex-1 overflow-auto scrollbar-hide">
          <router-outlet></router-outlet>
        </section>
      </main>      
    </div>
  `,
  styles: ``
})
export class MarcoAdminComponent {

}
