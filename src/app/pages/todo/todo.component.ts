import { Component, OnInit, ElementRef, AfterViewInit, ViewChild, HostListener, NgZone } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-inicio',
  imports: [RouterModule, CommonModule],
  template: `
  <div #container class="bg-black px-[40px] mx-auto max-w-full">
    <div class="flex flex-row gap-4 text-[15px] sticky top-0 bg-black z-0 shadow-md pb-[20px] pt-[35px]">
      <button 
        class="text-white font-semibold rounded-2xl w-25 h-6" 
        [ngClass]="{'bg-[var(--buttonhover)]': activeSection === 'todo', 'bg-[var(--button)]': activeSection !== 'todo'}"
        (click)="showSection('todo')">
        Todo
      </button>
      
      <button 
        class="text-white font-semibold rounded-2xl w-25 h-6" 
        [ngClass]="{'bg-[var(--buttonhover)]': activeSection === 'musica', 'bg-[var(--button)]': activeSection !== 'musica'}"
        (click)="showSection('musica')">
        Música
      </button>

      <button 
        class="text-white font-semibold rounded-2xl w-25 h-6" 
        [ngClass]="{'bg-[var(--buttonhover)]': activeSection === 'podcasts', 'bg-[var(--button)]': activeSection !== 'podcasts'}"
        (click)="showSection('podcasts')">
        Pódcasts
      </button>
    </div>

    <div *ngIf="activeSection === 'todo'">
      <!-- Sección: Lo mejor de cada artista -->
      <div class="pt-[10px]">
        <p class="text-white font-bold text-[30px]">Lo mejor de cada artista</p>
        <div class="flex gap-[42px] pt-2 overflow-hidden whitespace-nowrap flex-nowrap">
        @if (homeData) {
          @for (cantante of homeData.listas_artistas_info.slice(0, getVisibleLarge10()); track cantante) {
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
          @for (gen of homeData.listas_genero_info.slice(0, getVisibleLarge10()); track gen.nombre) {
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
          @for (top of homeData.listas_idioma_info.slice(0, getVisibleLarge10()); track top) {
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
        @for (podcast of homeData.podcasts.slice(0, getVisibleLarge10()); track podcast) {
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

    <div *ngIf="activeSection === 'musica'">
      <!-- Sección: Spongefy recomienda -->
      <div class="pt-[10px]">
        <p class="text-white font-bold text-[30px]">Spongefy recomienda</p>
        <div class="flex gap-[60px] pt-2 overflow-hidden whitespace-nowrap flex-nowrap">
          <div *ngFor="let lista of musicaData.listas_aleatorio_info; let i = index">
            <div *ngIf="i < visibleItems"
              class="bg-[var(--sponge)] w-[240px] h-[240px] rounded-[40px] flex-none flex items-end justify-start overflow-hidden"
              [ngStyle]="{'background-color': lista.color}">
              <p class="text-black font-extrabold text-left text-[41px] mb-5 ml-[-4px] p-0 leading-none"
                style="word-break: break-word; white-space: normal;">
                {{ lista.nombre }}
              </p>
            </div>
          </div>
        </div> 
      </div>

      <!-- Sección: Lo mejor de ??? -->
      <div class="pt-[20px]">
        <p class="text-white font-bold text-[30px]">Lo mejor de {{musicaData.artista.nombre_artista}}</p>
        <div class="flex flex-row mt-2 bg-[#151515] h-[240px] rounded-[40px]">
          <div>
            <img class="object-cover h-[240px] w-[240px] rounded-[40px]" [src]="musicaData.artista.link_imagen">
          </div>
          <div class="flex-1 grid grid-flow-row auto-rows-fr gap-2 overflow-hidden ml-5"
          [ngClass]="getGridColsClass()">
            <div *ngFor="let cancionAlbum of musicaData.artista.canciones_albumes; let i = index">
              <div *ngIf="cancionAlbum && cancionAlbum.link_imagen" 
                  class="min-w-[170px] flex flex-col justify-start items-center p-4 rounded-lg"
                  [ngClass]="{'hidden': shouldHideLoMejorDe(i)}">
                <div class="w-[170px] flex flex-col items-center">
                  <div class="w-[170px] h-[170px] overflow-hidden rounded-[20px]">
                    <img [src]="cancionAlbum.link_imagen" class="w-full h-full object-cover">
                  </div>
                  <div class="text-[10px] text-white pt-3 font-semibold self-start">
                    {{ cancionAlbum.titulo }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección: Descubre música nueva -->
      <div class="pt-5">
          <p class="text-white font-bold text-[30px]">Descubre música nueva</p>
          <div class="flex gap-[42px] pt-2 overflow-hidden flex-nowrap">
          @if (musicaData) {
            @for (gen of musicaData.listas_genero_info.slice(0, getVisibleLarge10()); track gen.nombre) {
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
          @if (musicaData) {  
            @for (top of musicaData.listas_idioma_info.slice(0, getVisibleLarge10()); track top) {
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

        <!-- Sección: Lo mejor de cada artista -->
        <div class="pt-[10px]">
          <p class="text-white font-bold text-[30px]">Lo mejor de cada artista</p>
          <div class="flex gap-[42px] pt-2 overflow-hidden whitespace-nowrap flex-nowrap">
          @if (musicaData) {
            @for (cantante of musicaData.listas_artistas_info.slice(0, getVisibleLarge10()); track cantante) {
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
    </div>

    <div *ngIf="activeSection === 'podcasts'">
      <!-- Sección: Spongefy recomienda -->
      <div class="pt-[10px]">
        <p class="text-white font-bold text-[30px]">Spongefy recomienda</p>
        <div class="flex gap-[60px] pt-2 overflow-hidden whitespace-nowrap flex-nowrap">
          <div *ngFor="let lista of podcastData.listas_aleatorio_info; let i = index">
            <div *ngIf="i < visibleItems"
              class="bg-[var(--sponge)] w-[240px] h-[240px] rounded-[40px] flex-none flex items-end justify-start overflow-hidden"
              [ngStyle]="{'background-color': lista.color}">
              <p class="text-black font-extrabold text-left text-[41px] mb-5 ml-[-4px] p-0 leading-none"
                style="word-break: break-word; white-space: normal;">
                {{ lista.nombre }}
              </p>
            </div> 
          </div>
        </div> 
      </div>

      <!-- Sección: Lo mejor de ??? -->
      <div class="pt-[20px]">
        <p class="text-white font-bold text-[30px]">Lo último de {{this.podcastData.podcast.nombre_podcast}}</p>
        <div class="flex flex-row mt-2 bg-[#151515] h-[404px] rounded-[40px]">
          <div class="w-[404px] object-cover rounded-[40px] flex-shrink-0">
            <img class="object-cover h-[404px] w-[404px] rounded-[40px]" [src]="this.podcastData.podcast.foto_podcast">
          </div>
          <div class="text-white pl-[38px] pt-[33px] pr-[50px] flex flex-col gap-[30px]">
            <ng-container *ngFor="let episodio of podcastData.podcast.episodios_recientes; let i = index">
              <div class="flex flex-row" [ngClass]="{'hidden': shouldHideLoMejorDe(i)}">
                <img class="w-[62px] h-[62px] rounded-[20px]" [src]="podcastData.podcast.foto_podcast">
                <div class="flex flex-col ml-2">
                  <p class="font-semibold line-clamp-1">{{ episodio.titulo }}</p>
                  <p class="line-clamp-2 text-sm"> {{ episodio.descripcion }}</p>
                </div>
              </div>
            </ng-container>
          </div>
        </div>
      </div>

      <!-- Sección: Lo mejor de cada artista -->
      <div class="pt-[10px]">
        <p class="text-white font-bold text-[30px]">Lo mejor de cada artista</p>
        <div class="flex gap-[42px] pt-2 overflow-hidden whitespace-nowrap flex-nowrap">
        @if (podcastData) {
          @for (cantante of podcastData.listas_podcasters_info.slice(0, getVisibleLarge10()); track cantante) {
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

      <!-- Sección: Éxito en pódcasts -->
      <div class="pt-5 pb-10">
        <p class="text-white font-bold text-[30px]">Éxito en pódcasts</p>
        <div class="flex gap-[42px] pt-2 overflow-hidden whitespace-nowrap flex-nowrap">
        @if (podcastData) {
        @for (podcast of podcastData.podcasts.slice(0, getVisibleLarge10()); track podcast) {
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
  </div> 
  `,
  styles: ``
})
export class TodoComponent implements OnInit, AfterViewInit {
  @ViewChild('container', { static: false }) container!: ElementRef;

  homeData: any = null;
  musicaData: any = null;
  podcastData: any = null;
  activeSection: string = 'todo';

  containerWidth: number = 0;
  visibleItems: number = 5;
  private resizeObserver!: ResizeObserver;

  showSection(section: string) {
    this.activeSection = section;
  }
  
  constructor (
    private authService: AuthService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    forkJoin({
      home: this.authService.getHome(),
      musica: this.authService.getHomeMusic(),
      podcast: this.authService.getHomePodcast()
    }).subscribe(
      (results) => {
        this.homeData = results.home;
        this.musicaData = results.musica;
        this.podcastData = results.podcast;
      },
      (error) => {
        console.error('Error al obtener los datos de la API', error);
      }
    );
  }

  ngAfterViewInit() {
    this.containerWidth = this.container.nativeElement.clientWidth;
    this.updateVisibleItems();
    this.getGridColsClass();
    // Usar ResizeObserver para detectar cambios en el tamaño del contenedor
    this.resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        // Ejecutar dentro de NgZone para actualizar Angular correctamente
        this.ngZone.run(() => {
          this.containerWidth = this.container.nativeElement.clientWidth;
          this.updateVisibleItems();
          this.getGridColsClass();

        });
      }
    });

    if (this.container?.nativeElement) {
      this.resizeObserver.observe(this.container.nativeElement);
    }
  }

  updateVisibleItems(): void {
    if (this.containerWidth < 630) this.visibleItems = 1;
    else if (this.containerWidth < 930) this.visibleItems = 2;
    else if (this.containerWidth < 1230) this.visibleItems = 3;
    else if (this.containerWidth < 1530) this.visibleItems = 4;
    else if (this.containerWidth < 1820) this.visibleItems = 5;
    else this.visibleItems = 6;
  }

  shouldHideLoMejorDe(index: number): boolean {
    if (this.containerWidth <= 560 && index >= 0) return true; // Si el ancho es menor a 400px, oculta desde el tercer elemento
    if (this.containerWidth <= 740 && index >= 1) return true; // Si el ancho es menor a 400px, oculta desde el tercer elemento
    if (this.containerWidth <= 930 && index >= 2) return true; // Si el ancho es menor a 400px, oculta desde el tercer elemento
    if (this.containerWidth <= 1200 && index >= 3) return true; // Si el ancho es menor a 400px, oculta desde el tercer elemento
    if (this.containerWidth <= 1500 && index >= 4) return true; // Si el ancho es menor a 400px, oculta desde el tercer elemento
    return false; // Muestra todo en anchos mayores
  }

  getGridColsClass(): string {
    if (this.containerWidth <= 560) return 'grid-cols-0'; // Pantallas pequeñas
    if (this.containerWidth <= 740) return 'grid-cols-1'; // Pantallas pequeñas
    if (this.containerWidth <= 930) return 'grid-cols-2'; // max-lg
    if (this.containerWidth <= 1200) return 'grid-cols-3'; // max-xl
    if (this.containerWidth <= 1500) return 'grid-cols-4'; // max-2xl
    return 'grid-cols-5'; // Default
  }

  getVisibleLarge10(): number {
    // Calcula cuántos artistas mostrar basado en el ancho del contenedor
    if (!this.containerWidth) return 1; // Valor por defecto si no hay ancho
    if (this.containerWidth <= 470) return 1;
    if (this.containerWidth <= 685) return 2;
    if (this.containerWidth <= 900) return 3;
    if (this.containerWidth <= 1115) return 4;
    if (this.containerWidth <= 1330) return 5;
    if (this.containerWidth <= 1545) return 6;
    if (this.containerWidth <= 1760) return 7;
    if (this.containerWidth <= 1975) return 8;
    if (this.containerWidth <= 2190) return 9;
    return 10;
  }
  

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
  
}
