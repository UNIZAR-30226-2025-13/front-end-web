import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inicio',
  imports: [RouterModule],
  template: `
  <div class="bg-black pl-[80px]">
    <div class="flex flex-row gap-4 text-[15px] sticky top-0 bg-black z-0 shadow-md pb-[30px] pt-[35px]">
      <button routerLink="/inicio/todo" class="bg-[var(--buttonhover)] text-white font-semibold rounded-2xl w-25 h-6">Todo</button>
      <button routerLink="/inicio/musica" class="bg-[var(--button)] text-white font-semibold rounded-2xl w-25 h-6">Música</button>
      <button routerLink="/inicio/podcasts" class="bg-[var(--button)] text-white font-semibold rounded-2xl w-25 h-6">Pódcasts</button>
    </div>

    
      <!-- Sección: Lo mejor de cada artista -->
      <div class="pt-[10px]">
        <p class="text-white font-bold text-[30px]">Lo mejor de cada artista</p>
        <div class="flex gap-[42px] pt-2 overflow-hidden whitespace-nowrap flex-nowrap">
        @if (homeData) {
          @for (cantante of homeData.listas_artistas_info; track cantante) {
            <div class="flex flex-col">
              <div class="w-[170px] h-[170px] overflow-hidden rounded-[20px]">
                <img src="{{cantante.link_imagen}}" class="w-full h-full object-cover">
              </div>
              <div class="text-white pt-3 font-semibold">{{cantante.nombre}}</div>
            </div>
          }
        } @else {
          <div class="w-full h-[205px] bg-black">
          </div>
        }
        </div> 
      </div>

      <!-- Sección: Descubre música nueva -->
      <div class="pt-5">
        <p class="text-white font-bold text-[30px]">Descubre música nueva</p>
        <div class="flex gap-[42px] pt-2 overflow-hidden flex-nowrap">
        @if (homeData) {
          @for (gen of homeData.listas_genero_info; track gen.nombre) {
              <div 
                class="w-[170px] h-[170px] rounded-[20px] flex-none flex items-end justify-start overflow-hidden" 
                [style.background-color]="gen.color"
              >
                <p 
                  class="text-black font-extrabold text-left text-[30px] mb-4 ml-[-4px] p-0 leading-none"
                  style="word-break: break-word; white-space: normal;"
                >
                  {{ gen.nombre }}
                </p>
              </div>
            }
          } @else {
          <div class="w-full h-[205px] bg-black">
          </div>
        }
        </div>
      </div>


      <!-- Sección: Conoce la música de cada idioma -->
      <div class="pt-5">
        <p class="text-white font-bold text-[30px]">Conoce la música de cada idioma</p>
        <div class="flex gap-[42px] pt-2 overflow-hidden whitespace-nowrap flex-nowrap">
        @if (homeData) {  
          @for (top of homeData.listas_idioma_info; track top) {
              <div 
                class="w-[170px] h-[170px] rounded-[20px] flex-none flex items-end justify-start overflow-hidden" 
                [style.background-color]="top.color"
              >
                <p 
                  class="text-black font-extrabold text-left text-[30px] mb-4 ml-[-4px] p-0 leading-none"
                  style="word-break: break-word; white-space: normal;"
                >
                  {{ top.nombre }}
                </p>
              </div>
            }
          } @else {
            <div class="w-full h-[205px] bg-black">
            </div>
          }
        </div>
      </div> 

      <!-- Sección: Éxito en pódcasts -->
      <div class="pt-5 pb-10">
        <p class="text-white font-bold text-[30px]">Éxito en pódcasts</p>
        <div class="flex gap-[42px] pt-2 overflow-hidden whitespace-nowrap flex-nowrap">
        @if (homeData) {
        @for (podcast of homeData.podcasts; track podcast) {
            <div class="flex flex-col">
              <div class="w-[170px] h-[170px] overflow-hidden rounded-[20px]">
                <img src="{{podcast.link_imagen}}" class="w-full h-full object-cover">
              </div>
              <div class="text-white pt-2 font-semibold">{{podcast.nombre}}</div>
            </div>
          }
        } @else {
          <div class="w-full h-[205px] bg-black">
          </div>
        }
        </div>
      </div>  
  </div> 
  `,
  styles: ``
})
export class TodoComponent implements OnInit {
  homeData: any = null;
  
  constructor (
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.getHome().subscribe(
      (data) => {
        this.homeData = data; // Almacena la respuesta de la API
      },
      (error) => {
        console.error('Error al obtener los datos de la API', error);
      }
    );
  }
}
