import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { BrowserModule } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { Subscription, forkJoin, map, catchError, of } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BusquedaService } from '../../services/busqueda.service';





@Component({
  selector: 'app-perfil-usuario',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-black pt-4 px-[34px] h-min-full">
      <div class="flex bg-opacity-60 p-4 rounded-[40px] items-end bg-[var(--spongedark)]">
        
      <div class="pl-[14px] flex-grow">
        <div class="flex items-center">
          <h1 class="font-montserrat font-bold text-5xl ml-[-2px] text-white">
            {{usuarioInfo}}
          </h1>
          <button class="bg-[var(--sponge)] border-white rounded-full flex items-center px-4 py-[6px] ml-4 hover:bg-[var(--lightSponge)]"
          [routerLink]="['/inicio/datospersonales/', usuarioInfo]">
            <img src="assets/editar.png" alt="Editar" class="w-4 h-4 mr-2">
            <p class="font-montserrat font-bold text-sm text-white">Editar</p>
          </button>
        </div>

        <div class="flex items-center mt-2">
          <p class="text-[var(--lightSponge)] text-base max-sm:hidden font-bold">
            {{playlists.length}}&nbsp;listas públicas -
          </p>
          <p class="text-[var(--lightSponge)] text-base max-sm:hidden font-bold"> seguidores -  </p>
          <p class="text-[var(--lightSponge)] text-base max-sm:hidden font-bold"> seguidos </p>
        </div>
      </div>


        <div class="flex-shrink-0">
          <img src="assets/logo2.png" alt="Logo" class="w-45 h-35 rounded-r-[40px]">
        </div>

      </div>


      <!-- Sección de listas publicas-->
      @if (playlists.length > 0) {
        <div class="w-2/3 max-xl:w-full pr-20 max-xl:pr-0 mt-10">
            <h2 class="font-montserrat font-bold text-2xl text-white mb-3">
                Listas públicas
            </h2>
        </div>

        <div class="flex gap-[40px] pt-1 overflow-hidden whitespace-nowrap flex-nowrap">
          @for(playlist of playlists; track playlist.name) {
            <li>
              <div class="w-[150px] h-[150px] rounded-[40px] flex-none flex items-end justify-start overflow-hidden transition-transform duration-300 hover:scale-97 cursor-pointer" 
              [style.background-color]="playlist.color" [routerLink]="['/inicio/lista_reproduccion/', (playlist.id)]">
                <p class="text-black font-extrabold text-left text-[30px] mb-5 ml-[-4px] p-0 leading-none"
                  style="word-break: break-word; white-space: normal;"> {{playlist.name}} </p>
              </div>
            </li>
          }
        </div>
      }
      

      <!-- Sección de artistas a los que sigues -->
      @if (favoriteArtists.length > 0) {
        <div>
          <h2 class="text-2xl font-semibold mb-4">Artistas a los que sigues</h2>
          <div class="flex gap-10 pb-2 overflow-visible scrollbar-hide">
            @for (artist of favoriteArtists; track artist.name) {
              <div class="flex flex-col items-center space-y-2 max-w-xs transition-transform duration-300 hover:scale-110 cursor-pointer">
                
                <div class="relative w-30 h-30 min-w-30 min-h-30">
                  <img [src]="artist.image" alt="{{ artist.name }}" class="w-full h-full rounded-lg object-cover" 
                  [routerLink]="['/inicio/artista/', encodeNombreArtista(artist.name)]">
                </div>
                
                <span class="text-center font-semibold text-sm break-words w-30 mt-2">{{ artist.name }}</span>
              </div>
            }
          </div>
        </div>
      }



    </div>
  `,
  styles: []
})


export class PerfilUsuarioComponent implements OnInit {
  
  usuarioInfo: any = null;

  playlists: any[] = [];
  favoriteArtists: any[] = [];
  
  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.usuarioInfo = this.route.snapshot.paramMap.get('nombre_usuario') ?? '';
      console.log(this.usuarioInfo);

      if (this.usuarioInfo) {
        this.loadPlaylists(this.usuarioInfo);
      }
    });
  }


  encodeNombreArtista(nombre: string): string {
    return encodeURIComponent(nombre);
  }

  loadPlaylists(nombreUsuario: string) {
    this.authService.getPublicLists(nombreUsuario).pipe(
      map((response: any[]) => response.map(playlist => ({
        id: playlist.id_lista,
        name: playlist.nombre,
        color: playlist.color
      }))),
      catchError(err => {
        console.error('Error al obtener playlists:', err);
        return of([]);
      })
    ).subscribe(playlists => this.playlists = playlists);
  }

  loadFavoriteArtists(nombreUsuario: string) {
    this.authService.getUserLists(nombreUsuario).pipe(
      map((response: any) => {
        if (response && response.artistas_favoritos) {
          return response.artistas_favoritos.map((artista: any) => ({
            name: artista.nombre_artista,
            image: artista.link_imagen
          }));
        }
        return [];
      }),
      catchError(err => {
        console.error('Error al obtener artistas favoritos:', err);
        return of([]);
      })
    ).subscribe(artists => this.favoriteArtists = artists);
  }
  


  editarPerfil() {}

  


}
