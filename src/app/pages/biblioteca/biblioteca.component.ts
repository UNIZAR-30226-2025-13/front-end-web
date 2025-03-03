import { Component, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-biblioteca',
  template: `
    <div #biblioteca class="bg-[var(--graybackground)] text-white p-5 h-screen flex flex-col min-w-[100px] max-w-[600px] w-[250px] overflow-auto fixed left-0 top-0 rounded-tr-2xl rounded-br-2xl">
      <div class="w-3 bg-transparent hover:bg-gray-600 cursor-ew-resize absolute top-0 bottom-0 right-0"
           (mousedown)="iniciarRedimension($event)"></div>
      <div class="flex items-center gap-2">
        <!-- Icono de la carpeta -->
        <img src="assets/biblioteca.png" alt="Biblioteca Icono" class="w-10 h-10" />
        @if (ancho >= 300) {
          <h2 class="text-lg font-bold whitespace-nowrap">
            Tu biblioteca
          </h2>
        }
      </div>
      @if (ancho >= 300) {
        <div class="flex gap-2 my-2">
          <button class="bg-gray-800 text-white px-3 py-1 rounded-full hover:bg-gray-700">Listas</button>
          <button class="bg-gray-800 text-white px-3 py-1 rounded-full hover:bg-gray-700">Podcasters</button>
          <button class="bg-gray-800 text-white px-3 py-1 rounded-full hover:bg-gray-700">Artistas</button>
        </div>
      }

    
      <ul class="list-none p-0 flex-grow">
        <button class="text-[var(--sponge)] font-bold truncate w-full text-left p-2 hover:bg-gray-700 rounded">
          Tus canciones favoritas
        </button>

        <button class="text-[var(--sponge)] font-bold truncate w-full text-left p-2 hover:bg-gray-700 rounded">
          Tus episodios favoritos
        </button>

        @for (playlist of playlists; track playlist) {
          <li>
            <button class="text-white font-bold truncate w-full text-left p-2 hover:bg-gray-700 rounded">
              {{ playlist }}
            </button>
          </li>
        }
      </ul>
      <button class="bg-[var(--sponge)] text-white rounded-full text-2xl w-12 h-12 flex items-center justify-center absolute right-7 bottom-7 hover:bg-[var(--lightSponge)]">+</button>
    </div>
  `,
  styles: [``]
})
export class BibliotecaComponent {
  ancho: number = 250;
  playlists: string[] = ["discos4ever", "¿", "2025", "Mi playlist nº94329", "a la ducha", "Camino uni"];

  constructor(private elRef: ElementRef) {}

  iniciarRedimension(event: MouseEvent) {
    event.preventDefault();
    document.addEventListener('mousemove', this.redimensionar);
    document.addEventListener('mouseup', this.detenerRedimension);
  }

  redimensionar = (event: MouseEvent) => {
    let nuevaAncho = Math.max(100, Math.min(600, event.clientX)); // Usamos 100 como valor mínimo
    if (nuevaAncho >= 101 && nuevaAncho <= 299) {
      nuevaAncho = 100; // Si está en el intervalo no permitido, lo forzamos a 100px
    }
    this.ancho = nuevaAncho;
    this.elRef.nativeElement.querySelector('div').style.width = `${nuevaAncho}px`;
  };

  detenerRedimension = () => {
    document.removeEventListener('mousemove', this.redimensionar);
    document.removeEventListener('mouseup', this.detenerRedimension);
  };
}
