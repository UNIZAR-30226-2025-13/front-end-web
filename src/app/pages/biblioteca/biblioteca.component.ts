import { Component, HostListener, ElementRef, Renderer2, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-biblioteca',
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div #biblioteca class="p-5 bg-[var(--graybackground)] text-white h-full flex flex-col min-w-[100px] max-w-[600px] overflow-auto rounded-tr-2xl rounded-br-2xl relative"
         [ngStyle]="{ width: ancho + 'px' }">      
      <div class="w-3 bg-transparent cursor-w-resize absolute top-0 bottom-0 right-0"
           (mousedown)="iniciarRedimension($event)"></div>
      
      <div class="flex items-center"
      [ngStyle]="{
         'justify-content': ancho <= MIN_WIDTH ? 'center' : 'left',
         'gap': ancho >= MIN_WIDTH ? '0.5rem' : '0'
         }">
        <img src="assets/biblioteca.png" alt="Biblioteca Icono" class="w-10 h-10" />
        <h2 *ngIf="ancho > this.MIN_WIDTH" class="text-lg font-bold whitespace-nowrap">Tu biblioteca</h2>
      </div>
      
      <div *ngIf="ancho > this.MIN_WIDTH" class="flex gap-2 my-2">
        <button class="bg-[var(--button)] font-bold text-white px-4 rounded-full hover:bg-gray-700" (click)="cambiarListas()">Listas</button>
        <button class="bg-[var(--button)] font-bold text-white px-4 rounded-full hover:bg-gray-700" (click)="cambiarPodcasts()">Podcasts</button>
        <button class="bg-[var(--button)] font-bold text-white px-4 rounded-full hover:bg-gray-700" (click)="cambiarArtistas()">Artistas</button>
      </div>
      @if (ancho > this.MIN_WIDTH) {
        <hr class="my-2 bg-white border-0.5">
      }
      
      @if (mostrar === 'listas') {
        <ul class="list-none p-0 flex-grow text-xl ">
          @if (ancho > this.MIN_WIDTH) {
            <button class="mt-2 text-white bg-[var(--sponge)] font-bold truncate w-full text-left p-2 flex justify-between items-center rounded-[40px] transition-transform duration-300 hover:scale-99 cursor-pointer"
            [routerLink]="['/inicio/lista_reproduccion/', (combinedLists[0].id_lista)]">
                <p class="ml-2">Tus canciones favoritas</p>
                <img src="assets/heart.png" alt="Corazón" class="w-6 h-6 mr-2"> 
            </button>  
          } @else {
            <button class="mt-2 text-white bg-[var(--sponge)] font-bold truncate w-full text-left p-2 flex justify-center items-center rounded-[40px] transition-transform duration-300 hover:scale-99 cursor-pointer"
            [routerLink]="['/inicio/lista_reproduccion/', (combinedLists[0].id_lista)]">
              <img src="assets/heart.png" alt="Corazón" class="w-6 h-6"> 
            </button>  
          }
          @if (ancho > this.MIN_WIDTH) {  
            <button class="mt-2 text-white bg-[var(--spongedark)] font-bold truncate w-full text-left p-2 flex justify-between items-center rounded-[40px] transition-transform duration-300 hover:scale-99 cursor-pointer"
            [routerLink]="['/inicio/lista_reproduccion/', (combinedLists[1].id_lista)]">
              <p class="ml-2">Tus episodios favoritos</p>
              <img src="assets/heart.png" alt="Corazón" class="w-6 h-6 mr-2">   
            </button>
          } @else {
            <button class="mt-2 text-white bg-[var(--spongedark)] font-bold truncate w-full text-left p-2 flex justify-center items-center rounded-[40px] transition-transform duration-300 hover:scale-99 cursor-pointer"
            [routerLink]="['/inicio/lista_reproduccion/', (combinedLists[1].id_lista)]">
              <img src="assets/heart.png" alt="Corazón" class="w-6 h-6">   
            </button>
            }
          <li *ngFor="let playlist of combinedLists.slice(2); trackBy: trackByFn">
            <button class="flex flex-row mt-2 text-white font-bold truncate w-full text-left p-2 transition-transform duration-300 hover:scale-99 cursor-pointer"
            [routerLink]="playlist.type === 'lista' ? ['/inicio/lista_reproduccion/', playlist.id_lista] : null">
            <p class="ml-2 truncate">{{ playlist.nombre }}</p>
            @if (ancho > this.MIN_WIDTH) {  
              <img *ngIf="playlist.type === 'carpeta'" src="assets/folder.png" alt="Carpeta" class="w-6 h-6 ml-auto mr-2">
            }
            </button>
          </li>
        </ul>
      }
      @if (mostrar === 'podcasts') {
        <ul class="list-none p-0 flex-grow text-xl">
          <li *ngFor="let podcast of podcast_fav; trackBy: trackByFn">
            <button class="flex flex-row items-center mt-2 text-white font-bold truncate w-full text-left p-2 transition-transform duration-300 hover:scale-99 cursor-pointer"
            [routerLink]="['/inicio/podcaster', encodeNombreArtista(podcast.nombre_podcaster)]"
            [ngStyle]="{'padding-left': ancho <= MIN_WIDTH ? '7px' : '0px'}">
              <img [src]="podcast.link_imagen" class="min-w-12 min-h-12 w-12 h-12 rounded-[10px]">
              @if (ancho > this.MIN_WIDTH) { 
                <p class="ml-2">{{ podcast.nombre_podcaster }}</p>
              }
            </button>
          </li>
        </ul>
      }
      @if (mostrar === 'artistas') {
        <ul class="list-none p-0 flex-grow text-xl">
          <li *ngFor="let artista of artistas_fav; trackBy: trackByFn">
            <button class="flex flex-row items-center mt-2 text-white font-bold truncate w-full text-left p-2 transition-transform duration-300 hover:scale-99 cursor-pointer"
            [routerLink]="['/inicio/artista', encodeNombreArtista(artista.nombre_artista)]"
            [ngStyle]="{'padding-left': ancho <= MIN_WIDTH ? '7px' : '0px'}">
              <img [src]="artista.link_imagen" class="min-w-12 min-h-12 w-12 h-12 rounded-[10px]"> 
              @if (ancho > this.MIN_WIDTH) { 
                <p class="ml-2">{{ artista.nombre_artista }}</p>
              }
            </button>
          </li>
        </ul>
      }
      
      <button class="bg-[var(--sponge)] text-white rounded-full text-2xl w-12 h-12 flex items-center justify-center absolute right-7 bottom-7 hover:bg-[var(--spongedark)]" (click)="abrirPopup()">+</button>
      <!-- Popup modal para crear una lista -->
      <div *ngIf="mostrarPopup" class="fixed inset-0 flex items-center justify-center bg-black/70 z-10">
        <div class="bg-black p-6 rounded-lg w-1/2 max-w-xs border-2 border-white">
          <h3 class="text-xl font-bold mb-4 text-white">Crear nueva lista</h3>

          <!-- Nombre de la lista -->
          <label for="nombreLista" class="block text-white">Nombre de la lista</label>
          <input id="nombreLista" type="text" [(ngModel)]="nuevoNombre" 
            class="text-black border bg-gray-300 p-2 w-full rounded-[10px] mb-4" 
            placeholder="Ingresa un nombre" maxlength="25">
          <!-- Selección de color -->
          <label for="colorLista" class="block text-white">Seleccionar color</label>
          <input id="colorLista" type="color" [(ngModel)]="nuevoColor" 
            class="h-8 mb-4 w-full rounded-[10px]">

          <!-- Selección de tipo de contenido -->
          <label for="tipoLista" class="block text-white">Seleccionar tipo</label>
          <select id="tipoLista" [(ngModel)]="tipoLista" 
            class="text-black border bg-gray-300 p-2 w-full rounded-[10px] mb-4">
            <option value="canciones">Canciones</option>
            <option value="episodios">Episodios</option>
          </select>

          <!-- Botones -->
          <div class="flex justify-end gap-4">
            <button class="bg-[var(--buttonhover)] text-white px-2 py-1 rounded-[20px] hover:bg-[var(--button)]" (click)="cerrarPopup()">Cancelar</button>
            <button class="bg-[var(--sponge)] text-white px-2 py-1 hover:bg-[var(--spongedark)] rounded-[20px]" (click)="guardarLista()">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class BibliotecaComponent implements OnInit {
  mostrar = 'listas';
  ancho: number = 350;
  public readonly MIN_WIDTH: number = 100;
  private MAX_WIDTH: number = 400;
  private resizing: boolean = false;
  private startX: number = 0;
  private startWidth: number = 0;
  
  combinedLists: any[] = [];
  artistas_fav: any[] = [];
  podcast_fav: any[] = [];

  // Variables para el popup
  mostrarPopup: boolean = false;
  nuevoNombre: string = '';
  nuevoColor: string = '#000000'; // Color predeterminado (negro)
  tipoLista: string = 'canciones';

  constructor(
    private elRef: ElementRef, 
    private renderer: Renderer2,
    private authService: AuthService,
    private userService: UsuarioService,
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {}

  ngOnInit() {
    // Detecta el tamaño de la pantalla y ajusta MAX_WIDTH
    this.breakpointObserver.observe(['(max-width: 1250px)'])
      .subscribe(result => {
        if (result.matches) {
          this.MAX_WIDTH = 100;
          this.ancho = 100;
        }
        else {
          this.MAX_WIDTH = 600;
        }
      });

    const nombre_usuario = this.userService.getUsuario()?.nombre_usuario;
    if (!nombre_usuario) {
      console.error('No hay usuario en sesión');
      return;
    }
 
    this.authService.getUserLists(nombre_usuario).subscribe(
      (response: any) => {
        const listas = response.listas === "No hay listas" ? [] : response.listas;
        const carpetas = response.carpetas === "No hay carpetas" ? [] : response.carpetas;
    
        // Separa las listas favoritas del resto
        const favoritas = listas.filter((item: any) =>
          item.nombre === "Tus canciones favoritas" || item.nombre === "Tus episodios favoritos"
        );
    
        const listasFiltradas = listas.filter((item: any) =>
          item.nombre !== "Tus canciones favoritas" && item.nombre !== "Tus episodios favoritos"
        );
    
        // Convierte las listas y carpetas en un solo array con el tipo
        const combinedLists = [
          ...listasFiltradas.map((item: any) => ({ ...item, type: 'lista' })),
          ...carpetas.map((item: any) => ({ ...item, type: 'carpeta' }))
        ].sort((a, b) => a.nombre.localeCompare(b.nombre)); // Ordena alfabéticamente
    
        // Orden final: favoritas primero, luego el resto ordenado
        this.combinedLists = [
          ...favoritas.map((item: any) => ({ ...item, type: 'favorito' })), // Añadir tipo opcionalmente
          ...combinedLists
        ];
    
        this.artistas_fav = Array.isArray(response.artistas_favoritos) ? response.artistas_favoritos : [];
        this.podcast_fav = Array.isArray(response.podcasts_favoritos) ? response.podcasts_favoritos : [];
    
        console.log(response);
      },
      (error) => {
        console.error('Error al obtener las listas:', error);
      }
    );    
  }

  // Abrir el popup
  abrirPopup() {
    this.mostrarPopup = true;
  }

  // Cerrar el popup
  cerrarPopup() {
    this.mostrarPopup = false;
  }

  // Guardar la nueva lista
  guardarLista() {
    this.nuevoNombre = this.nuevoNombre.trim(); // Elimina espacios al inicio y al final
  
    if (!this.nuevoNombre) {
      alert('Por favor, ingrese un nombre para la lista.');
      return;
    }
  
    if (this.nuevoNombre.length > 25) {
      alert('El nombre de la lista no puede superar los 25 caracteres.');
      return;
    }
  
    const nombreProhibido = ["Tus canciones favoritas", "Tus episodios favoritos"];
    if (nombreProhibido.includes(this.nuevoNombre)) {
      alert(`El nombre "${this.nuevoNombre}" no está permitido.`);
      return;
    }
  
    if (this.nuevoNombre.toLowerCase().startsWith("this is")) {
      alert('El nombre de la lista no puede comenzar con "This is".');
      return;
    }
  
    if (!this.tipoLista) {
      alert('Por favor, seleccione un tipo de lista.');
      return;
    }
  
    // Simulación de guardado (puedes reemplazar esto con tu lógica para guardar en el backend)
    console.log('Guardando nueva lista:');
    console.log('- Nombre:', this.nuevoNombre);
    console.log('- Color:', this.nuevoColor);
    console.log('- Tipo:', this.tipoLista);
  
    // Aquí iría la lógica para agregar la lista a tu backend o servicio
  
    // Cerrar el popup después de guardar
    this.cerrarPopup();
  }
  

  iniciarRedimension(event: MouseEvent) {
    event.preventDefault();
    this.resizing = true;
    this.startX = event.clientX;
    this.startWidth = this.ancho;
    document.addEventListener('mousemove', this.redimensionar);
    document.addEventListener('mouseup', this.detenerRedimension);
  }

  redimensionar = (event: MouseEvent) => {
    let nuevaAncho = Math.max(this.MIN_WIDTH, Math.min(this.MAX_WIDTH, event.clientX)); // Usamos 100 como valor mínimo
    if (nuevaAncho >= 101 && nuevaAncho <= 350) {
      nuevaAncho = 100; // Si está en el intervalo no permitido, lo forzamos a 100px
    }
    this.ancho = nuevaAncho;
    this.elRef.nativeElement.querySelector('div').style.width = `${nuevaAncho}px`;
  };

  detenerRedimension = () => {
    this.resizing = false;
    document.removeEventListener('mousemove', this.redimensionar);
    document.removeEventListener('mouseup', this.detenerRedimension);
  };

  trackByFn(index: number, item: string): number {
    return index;
  }

  cambiarListas(){
    this.mostrar = 'listas'
  }

  cambiarPodcasts(){
    this.mostrar = 'podcasts'
  }

  cambiarArtistas(){
    this.mostrar = 'artistas'
  }

  encodeNombreArtista(nombre: string): string {
    return encodeURIComponent(nombre);
  }
}
