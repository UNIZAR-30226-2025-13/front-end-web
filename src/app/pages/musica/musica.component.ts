import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-musica',
  imports: [RouterModule],
  template: `
    <div class="bg-black pl-[80px] pr-[80px]">
    <div class="flex flex-row gap-4 text-[15px] sticky top-0 bg-black z-0 shadow-md pb-[20px] pt-[35px]">
      <button routerLink="/inicio/todo" class="bg-[var(--button)] text-white font-semibold rounded-2xl w-25 h-6">Todo</button>
      <button routerLink="/inicio/musica" class="bg-[var(--buttonhover)] text-white font-semibold rounded-2xl w-25 h-6">Música</button>
      <button routerLink="/inicio/podcasts" class="bg-[var(--button)] text-white font-semibold rounded-2xl w-25 h-6">Pódcasts</button>
    </div>

    <!-- Sección: Spongefy recomienda -->
    <div class="pt-[20px]">
      <p class="text-white font-bold text-[30px]">Spongefy recomienda</p>
      <div class="flex gap-[60px] pt-2 overflow-hidden whitespace-nowrap flex-nowrap">
        <div 
          class="bg-[var(--sponge)] w-[240px] h-[240px] rounded-[40px] flex-none flex items-end justify-start overflow-hidden">
          <p 
            class="text-black font-extrabold text-left text-[41px] mb-5 ml-[-4px] p-0 leading-none"
            style="word-break: break-word; white-space: normal;"
          >una lloradita y a seguir</p>
        </div>
        <div 
          class="max-md:hidden bg-[var(--sponge)] w-[240px] h-[240px] rounded-[40px] flex-none flex items-end justify-start overflow-hidden">
          <p 
            class="text-black font-extrabold text-left text-[41px] mb-5 ml-[-4px] p-0 leading-none"
            style="word-break: break-word; white-space: normal;"
          >una lloradita y a seguir</p>
        </div>
        <div 
          class="max-lg:hidden bg-[var(--sponge)] w-[240px] h-[240px] rounded-[40px] flex-none flex items-end justify-start overflow-hidden">
          <p 
            class="text-black font-extrabold text-left text-[41px] mb-5 ml-[-4px] p-0 leading-none"
            style="word-break: break-word; white-space: normal;"
          >una lloradita y a seguir</p>
        </div>
        <div 
          class="max-[1350px]:hidden bg-[var(--sponge)] w-[240px] h-[240px] rounded-[40px] flex-none flex items-end justify-start overflow-hidden">
          <p 
            class="text-black font-extrabold text-left text-[41px] mb-5 ml-[-4px] p-0 leading-none"
            style="word-break: break-word; white-space: normal;"
          >una lloradita y a seguir</p>
        </div>
        <div 
          class="max-[1620px]:hidden bg-[var(--sponge)] w-[240px] h-[240px] rounded-[40px] flex-none flex items-end justify-start overflow-hidden">
          <p 
            class="text-black font-extrabold text-left text-[41px] mb-5 ml-[-4px] p-0 leading-none"
            style="word-break: break-word; white-space: normal;"
          >una lloradita y a seguir</p>
        </div>
        <div 
          class="max-[1920px]:hidden bg-[var(--sponge)] w-[240px] h-[240px] rounded-[40px] flex-none flex items-end justify-start overflow-hidden">
          <p 
            class="text-black font-extrabold text-left text-[41px] mb-5 ml-[-4px] p-0 leading-none"
            style="word-break: break-word; white-space: normal;"
          >una lloradita y a seguir</p>
        </div>
        
        
      </div> 
    </div>

    <!-- Sección: Lo mejor de ??? -->
    
    <div class="pt-[20px]">
      <p class="text-white font-bold text-[30px]">Lo mejor de Feid</p>
      <div class="flex flex-row mt-2 bg-[#151515] h-[240px] rounded-[40px]">
          <div>
            <img class="object-cover h-[240px] w-[240px] rounded-[40px]" src="https://i.scdn.co/image/ab6761610000e5eb07620e28ffb1bdc8dd2d5ea0">
          </div>
          <div class="flex-1 grid grid-flow-col auto-cols-fr gap-2 overflow-hidden">
            <div class="w-auto flex flex-col justify-center items-center p-4 rounded-lg max-sm:hidden">
              <div class="w-[170px] flex flex-col items-center">
                <div class="w-[170px] h-[170px] overflow-hidden rounded-[20px]">
                  <img src="https://www.mondosonoro.com/wp-content/uploads/2023/12/FEID-FERXXOCALIPSIS.jpg" class="w-full h-full object-cover">
                </div>
                <div class="text-[10px] text-white pt-3 font-semibold self-start">FERXXOCALIPSIS</div>
              </div>
            </div>

            <div class="w-auto flex flex-col justify-center items-center p-4 rounded-lg max-md:hidden">
              <div class="w-[170px] flex flex-col items-center">
                <div class="w-[170px] h-[170px] overflow-hidden rounded-[20px]">
                  <img src="https://www.mondosonoro.com/wp-content/uploads/2023/12/FEID-FERXXOCALIPSIS.jpg" class="w-full h-full object-cover">
                </div>
                <div class="text-[10px] text-white pt-3 font-semibold self-start">FERXXOCALIPSIS</div>
              </div>
            </div>

            <div class="w-auto flex flex-col justify-center items-center p-4 rounded-lg max-lg:hidden">
              <div class="w-[170px] flex flex-col items-center">
                <div class="w-[170px] h-[170px] overflow-hidden rounded-[20px]">
                  <img src="https://www.mondosonoro.com/wp-content/uploads/2023/12/FEID-FERXXOCALIPSIS.jpg" class="w-full h-full object-cover">
                </div>
                <div class="text-[10px] text-white pt-3 font-semibold self-start">FERXXOCALIPSIS</div>
              </div>
            </div>

            <div class="w-auto flex flex-col justify-center items-center p-4 rounded-lg max-xl:hidden">
              <div class="w-[170px] flex flex-col items-center">
                <div class="w-[170px] h-[170px] overflow-hidden rounded-[20px]">
                  <img src="https://www.mondosonoro.com/wp-content/uploads/2023/12/FEID-FERXXOCALIPSIS.jpg" class="w-full h-full object-cover">
                </div>
                <div class="text-[10px] text-white pt-3 font-semibold self-start">FERXXOCALIPSIS</div>
              </div>
            </div>
            
            <div class="w-auto flex flex-col justify-center items-center p-4 rounded-lg max-2xl:hidden">
              <div class="w-[170px] flex flex-col items-center">
                <div class="w-[170px] h-[170px] overflow-hidden rounded-[20px]">
                  <img src="https://www.mondosonoro.com/wp-content/uploads/2023/12/FEID-FERXXOCALIPSIS.jpg" class="w-full h-full object-cover">
                </div>
                <div class="text-[10px] text-white pt-3 font-semibold self-start">FERXXOCALIPSIS</div>
              </div>
            </div>
          </div>
      </div>
    </div>

    <!-- Sección: Descubre música nueva -->
    <div class="pt-5">
      <p class="text-white font-bold text-[30px]">Descubre música nueva</p>
      <div class="flex gap-[43px] pt-2 overflow-hidden flex-nowrap">
        @for (gen of generos; track gen.nombre) {
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
      </div>
    </div>

    <!-- Sección: Conoce la música de cada idioma -->
    <div class="pt-5">
        <p class="text-white font-bold text-[30px]">Conoce la música de cada idioma</p>
        <div class="flex gap-[42px] pt-2 overflow-hidden whitespace-nowrap flex-nowrap">
          @for (top of top10; track top) {
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
        </div>
      </div> 

      <!-- Sección: Lo mejor de cada artista -->
      <div class="pt-2">
        <p class="text-white font-bold text-[30px]">Lo mejor de cada artista</p>
        <div class="flex gap-[42px] pt-2 overflow-hidden whitespace-nowrap flex-nowrap">
          @for (cantante of cantantes; track cantante) {
            <div class="flex flex-col">
              <div class="w-[170px] h-[170px] overflow-hidden rounded-[20px]">
                <img src="{{cantante.foto_url}}" class="w-full h-full object-cover">
              </div>
              <div class="text-white pt-3 font-semibold">This is {{cantante.nombre}}</div>
            </div>
          }
        </div> 
      </div>
    </div> 

  `,
  styles: ``
})
export class MusicaComponent {
  cantantes = [
    {
      "nombre": "Lola Indigo",
      "foto_url": "data:image/jpeg;base64,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",
      "nombre_artistico": "Lola Índigo"
    },
    {
      "nombre": "Aitana",
      "foto_url": "https://i.scdn.co/image/ab676161000051746872414f0e8384ca856e2ec8",
      "nombre_artistico": "Aitana"
    }
  ];

  generos =[
      { "nombre": "POP", "color": "#1E3A8A" },
      { "nombre": "ROCK", "color": "#7C3AED" },
      { "nombre": "HIP HOP", "color": "#F59E0B" },
      { "nombre": "INDIE", "color": "#FCD34D" },
      { "nombre": "JAZZ", "color": "#10B981" },
      { "nombre": "LATIN", "color": "#F87171" }
    ];

    spongefy =[
      { "nombre": "VERANO 2024", "color": "#EF9210" },
      { "nombre": "una lloradita y a seguir", "color": "#3858D9" },
      { "nombre": "workout⚡", "color": "#38D950" },
      { "nombre": "SAN VALENTIN", "color": "#E33273" },
      { "nombre": "una lloradita y a seguir", "color": "#3858D9" },
      { "nombre": "workout⚡", "color": "#38D950" },
      { "nombre": "SAN VALENTIN", "color": "#E33273" }
    ];

  top10 = [ 
      { "nombre": "TOP 10 GLOBAL", "color": "#1E3A8A" },
      { "nombre": "TOP 10 INGLES", "color": "#2563EB" },
      { "nombre": "TOP 10 ITALIANO", "color": "#84CC16" },
      { "nombre": "TOP 10 ESPAÑOL", "color": "#EF4444" },
      { "nombre": "TOP 10 FRANCES", "color": "#34D399" },
      { "nombre": "TOP 10 NORUEGO", "color": "#06B6D4" }
    ];

  podcasts = [
    {
      "nombre": "La Pija y la Quinqui",
      "foto_url": "data:image/jpeg;base64,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",
      "nombre_artistico": "La Pija y la Quinqui"
    },
    {
      "nombre": "Reyes del Palique",
      "foto_url": "data:image/jpeg;base64,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",
      "nombre_artistico": "Reyes del Palique"
    }
  ]
}
