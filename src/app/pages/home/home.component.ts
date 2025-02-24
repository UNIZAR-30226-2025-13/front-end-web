import { Component } from '@angular/core'; 

@Component({
  selector: 'app-home',
  imports: [],
  template: `
  <div class="bg-black">
    <div class="flex flex-row bg-black border-b-[3px] border-r-[3px] border-l-[3px] border-[var(--sponge)] w-full h-[90px] rounded-bl-[40px] rounded-br-[40px] justify-between items-center">
      <!-- Parte izquierda -->
      <div class="flex flex-row items-center ml-7 min-w-9">
        <img src="assets/play.png" class="w-9 h-9">
      </div>

      <!-- Parte central -->
      <div class="flex flex-row items-center space-x-4">
        <!-- Icono de casa fuera del buscador -->
        <div class="text-white max-sm:hidden">
          <img src="assets/home.png" class="w-9 h-9">
        </div>

        <!-- Barra de búsqueda funcional -->
        <div class="flex flex-row bg-[#1a1a1a] w-[400px] h-[50px] rounded-full items-center max-sm:w-[300px]">
            <!-- Icono de búsqueda -->
            <div class="text-white">
              <img src="assets/search.png" class="w-12 h-12">
            </div>
            <!-- Input de búsqueda -->
            <input 
                type="text" 
                placeholder="Buscar..." 
                class="flex-grow bg-transparent text-white placeholder-gray-500 outline-none"
            />
        </div>
    </div>

      <!-- Parte derecha -->
      <div class="flex flex-row mr-7 items-center gap-5">
        <img src="assets/friends.png" class="w-9 h-9 max-sm:hidden">
        <a class="bg-[var(--sponge)] w-9 h-9 rounded-3xl text-white flex items-center justify-center font-bold text-xl">
            P
        </a>
      </div>
    </div>
  </div>
  `,
  styles: ``
})
export class HomeComponent {

}
