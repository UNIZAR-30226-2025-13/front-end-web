import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { BusquedaService } from '../../services/busqueda.service';
import { Subscription, forkJoin, map, catchError, of } from 'rxjs';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-buscador',
  imports: [CommonModule, RouterModule],
  template: `
  <div class="p-8 bg-black min-h-screen text-white space-y-8">

    <!-- Mismo felx para creador principal y contenido multimedia -->
    <div class="flex flex-col md:flex-row gap-8">
      
      <!-- Resultado Creador Principal -->
      <div class="md:w-1/3"> 
        <h2 class="text-2xl font-semibold mb-4">Creador Principal</h2>
        <div class="flex flex-col items-start gap-4 bg-[var(--graybackground)] rounded-xl p-10 h-[460px]" >

          @if (principalCreator.tipo === 'Artista') {
            <img [src]="principalCreator.image" alt="Creador" class="w-74 h-74 rounded-2xl object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
            [routerLink]="['/inicio/artista/', encodeNombreArtista(principalCreator.name)]">
          }
        
          @if (principalCreator.tipo === 'Podcaster') {
            <img [src]="principalCreator.image" alt="Creador" class="w-74 h-74 rounded-lg object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
            [routerLink]="['/inicio/podcaster/', encodeNombreArtista(principalCreator.name)]">
          }

          <div class="flex-items-center gap-2 ">
            <span class="text-3xl font-bold">{{ principalCreator.name }}</span>
            <span class="text-lg ml-3">{{ principalCreator.tipo }}</span>
          </div>  
        </div>
      </div>




      <!-- Resultado Contenido Multimedia Principal -->
      <div class="md:w-2/3">
        <h2 class="text-2xl font-semibold mb-4">Contenido Multimedia Principal</h2>
        <div class="bg-[var(--graybackground)] rounded-xl p-4 space-y-3">
          @for (contenido of topMediaContent.slice(0,5); track contenido.title) {
            <a [routerLink]="getRouterLinkMultimedia(contenido)" class="block">
              <div class="flex items-center justify-between hover:bg-gray-500/20 rounded-[10px] transition-transform duration-300 hover:scale-101 p-2">
                <div class="flex items-center gap-4">
                  <img [src]="contenido.image" alt="{{ contenido.title }}" class="w-12 h-12 rounded-lg object-cover">

                  <!-- Contenedor en fila para título y tipo -->
                  <div class="flex flex-col items-start gap-1">
                    <div class="flex items-center"> 
                      <p class="text-xl font-semibold line-clamp-1">{{ contenido.title }}</p>
                      <p class="text-lg text-gray-400 ml-3">{{ contenido.tipo }}</p>
                    </div>
                    <p class="text-lg text-white">{{ contenido.artist }}</p>
                  </div>
                </div>
                <p class="text-lg text-white">{{ contenido.duration }}</p>
              </div>
            </a>
          }
        </div>
      </div>


    </div>


   

    <!-- Artistas -->
    @if (artists.length > 0) {
      <div>
        <h2 class="text-2xl font-semibold mb-4">Artistas</h2>
        <div class="flex gap-10 pb-2 overflow-x-scroll scrollbar-hide">
          @for (artist of artists; track artist.name) {
            <div class="flex flex-col items-center space-y-2 max-w-xs transition-transform duration-300 hover:scale-97 cursor-pointer">
              
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





    <!-- Podcasters -->
    @if (podcasters.length > 0) {
    <div>
      <h2 class="text-2xl font-semibold mb-4">Podcasters</h2>
      <div class="flex gap-10 pb-2 overflow-x-scroll scrollbar-hide">
        @for (podcaster of podcasters; track podcaster.name) {
          <div class="flex flex-col items-center space-y-2 max-w-xs transition-transform duration-300 hover:scale-97 cursor-pointer">
            <img [src]="podcaster.image" alt="{{ podcaster.name }}" class="w-30 h-30 rounded-lg object-cover"
            [routerLink]="['/inicio/podcaster/', encodeNombreArtista(podcaster.name)]">

            <span class="text-center text-sm break-words w-30">{{ podcaster.name }}</span>
          </div>
        }
      </div>
    </div>
    }

    <!-- Albumes -->
    @if (albums.length > 0) {
      <div>
        <h2 class="text-2xl font-semibold mb-4">Álbumes</h2>
        <div class="flex gap-10 pb-2 overflow-x-scroll scrollbar-hide">
          @for (album of albums; track album.name) {
            <div class="flex flex-col items-center space-y-2 max-w-xs transition-transform duration-300 hover:scale-97 cursor-pointer">
              <img [src]="album.image" alt="{{ album.name }}" class="w-30 h-30 rounded-lg object-cover"
              [routerLink]="['/inicio/album/', album.id]">
              
              <span class="text-center font-semibold text-sm break-words w-30 line-clamp-2">
                {{ album.name }}
              </span>
              
              <span class="text-center text-sm">{{ album.artist }}</span>
            </div>
          }
        </div>
      </div>
    }


    <!-- Podcasts -->
    @if (podcasts.length > 0) {
    <div>
      <h2 class="text-2xl font-semibold mb-4">Podcasts</h2>
      <div class="flex gap-10 pb-2 overflow-x-scroll scrollbar-hide">
        @for (podcast of podcasts; track podcast.id) {
          <div class="flex flex-col items-center space-y-2 max-w-xs transition-transform duration-300 hover:scale-97 cursor-pointer">
            <img [src]="podcast.image" alt="{{ podcast.name }}" class="w-30 h-30 rounded-lg object-cover"
            [routerLink]="['/inicio/podcast/', podcast.id]">

            <span class="text-center text-sm font-semibold break-words w-30">{{ podcast.name }}</span>
          </div>
        }
      </div>
    </div>
    }

    
    <!-- Canciones -->
    @if (songs.length > 0) {
    <div>
      <h2 class="text-2xl font-semibold mb-4">Canciones</h2>
      <div class="flex gap-10 pb-2 overflow-x-scroll scrollbar-hide">
        @for (song of songs; track song.title) {
          <div class="flex flex-col items-center space-y-2 max-w-xs transition-transform duration-300 hover:scale-97 cursor-pointer">
            <img [src]="song.image" alt="{{ song.title }}" class="w-30 h-30 rounded-lg object-cover"
            [routerLink]="['/inicio/cancion/', song.id]">
            <span class="text-center font-semibold text-sm break-words w-30">{{ song.title }}</span>
            <span class="text-center text-sm">{{ song.artist }}</span>
          </div>
        }
      </div>
    </div>
    }

    <!-- Episodios -->
    @if (episodes.length > 0) {
    <div>
      <h2 class="text-2xl font-semibold mb-4">Episodios</h2>
      <div class="flex gap-10 pb-2 overflow-x-scroll scrollbar-hide">
        @for (episode of episodes; track episode.title) {
          <div class="flex flex-col items-center space-y-2 max-w-xs transition-transform duration-300 hover:scale-97 cursor-pointer">
            <img [src]="episode.image" alt="{{ episode.title }}" class="w-30 h-30 rounded-lg object-cover">
            <span class="text-center font-semibold text-sm break-words w-30 line-clamp-2">{{ episode.title }}</span>
            <span class="text-center text-sm">{{ episode.podcast }}</span>
          </div>
        }
      </div>
    </div>
    }

            

    <!-- Listas -->
    @if (listas.length > 0) {
      <div>
        <h2 class="text-2xl font-semibold mb-4">Listas públicas</h2>
        <div class="flex gap-10 pb-2 overflow-x-scroll scrollbar-hide">
          @for (lista of listas; track lista.name) {
 
            <div 
            class="w-30 h-30 rounded-lg flex-none flex items-end justify-start overflow-visible transition-transform duration-300 hover:scale-97 cursor-pointer" 
                [style.background-color]="lista.color" [routerLink]="['/inicio/lista_reproduccion/', (lista.id)]"
            >
                <p 
                  class="text-black font-extrabold text-left text-[24px] mb-4 ml-[-4px] p-0 leading-none"
                  style="word-break: break-word; white-space: normal;"
                >
                  {{ lista.name }}
                </p>
              </div>

          }
        </div>
      </div>
    }



    <!-- Usuarios -->
    @if (usuarios.length > 0) {
    <div>
      <h2 class="text-2xl font-semibold mb-4">Usuarios</h2>
      <div class="flex gap-10 pb-2 overflow-x-auto scrollbar-hide whitespace-nowrap"> 
        @for (usuario of usuarios; track usuario.email) {
          <!-- Cuadrado gris -->
          <div class="w-30 h-30 bg-[var(--graybackground)] flex-none flex items-center justify-center rounded-lg transition-transform duration-300 hover:scale-97 cursor-pointer"
          [routerLink]="['/inicio/usuario/', usuario.name]">
            <p class="text-md text-white text-center">{{ usuario.name }}</p>
          </div>
        }
      </div>
    </div>
    }






  </div>

  `,
  styles: `
    .overflow-x-auto {
      overflow-x: auto;
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    .overflow-x-auto::-webkit-scrollbar {
      display: none;
    }

  `
})
export class BuscadorComponent implements OnInit {
  principalCreator: any = {};
  topMediaContent: any[] = [];
  artists: any[] = [];
  podcasters: any[] = [];
  albums: any[] = [];
  podcasts: any[] = [];
  songs: any[] = [];
  episodes: any[] = [];
  listas: any[] = [];
  usuarios: any[] = [];

  subscription!: Subscription;



  constructor(
    private authService: AuthService,
    private busquedaService: BusquedaService
  ) {}

  ngOnInit() {
    this.subscription = this.busquedaService.cadenaBusqueda$.subscribe(nuevaCadena => {
      if (nuevaCadena.trim() !== '') { 
        forkJoin({
          principalCreator: this.getPrincipalCreator(nuevaCadena),
          contenidoMultimedia: this.getContenidoMultimedia(nuevaCadena),
          artistas: this.getArtistas(nuevaCadena),
          podcasters: this.getPodcasters(nuevaCadena),
          albums: this.getAlbums(nuevaCadena),
          podcasts: this.getPodcasts(nuevaCadena),
          canciones: this.getCanciones(nuevaCadena),
          episodios: this.getEpisodios(nuevaCadena),
          listas: this.getListas(nuevaCadena),
          usuarios: this.getUsuarios(nuevaCadena)
        }).subscribe(resultados => {
          // Aquí se actualizan los valores después de recibir todos los datos
          this.principalCreator = resultados.principalCreator;
          this.topMediaContent = resultados.contenidoMultimedia;
          this.artists = resultados.artistas;
          this.podcasters = resultados.podcasters;
          this.albums = resultados.albums;
          this.podcasts = resultados.podcasts;
          this.songs = resultados.canciones;
          this.episodes = resultados.episodios;
          this.listas = resultados.listas;
          this.usuarios = resultados.usuarios;
  
          console.log('Todos los resultados obtenidos:', resultados);
        });
      }
    });
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  
  
  getPrincipalCreator(name: string) {
    return this.authService.searchCreator(name).pipe(
      map((response: any) => {
        if (response.creadores && response.creadores.length > 0) {
          const creator = response.creadores[0];
          return {
            name: creator.nombre_creador,
            image: creator.link_imagen,
            tipo: creator.tipo
          };
        } else {
          return {}; // Retornar objeto vacío si no hay resultados
        }
      }),
      catchError(err => {
        console.error('Error al obtener el creador principal:', err);
        return of({}); // Retornar un observable con objeto vacío
      })
    );
  }
  
  getContenidoMultimedia(name: string) {
    return this.authService.searchMultimedia(name).pipe(
      map((response: any) => {
        if (response.top10Completo && response.top10Completo.length > 0) {
          return response.top10Completo.map((contenido: any) => ({
            title: contenido.titulo,
            artist: contenido.cantante || contenido.podcast || 'Desconocido',
            duration: contenido.duracion,
            tipo: contenido.tipo,
            image: contenido.link_imagen
          }));
        } else {
          return [];
        }
      }),
      catchError(err => {
        console.error('Error al obtener contenido multimedia:', err);
        return of([]); 
      })
    );
  }
  
  
  getArtistas(name: string) {
    return this.authService.searchCreator(name).pipe(
      map((response: any) => {
        if (response.creadores && response.creadores.length > 0) {
          return response.creadores
            .filter((creator: any) => creator.tipo === 'Artista')
            .map((artist: any) => ({
              name: artist.nombre_creador,
              image: artist.link_imagen
            }));
        } else {
          return [];
        }
      }),
      catchError(err => {
        console.error('Error al obtener artistas:', err);
        return of([]);
      })
    );
  }
  
  getPodcasters(name: string) {
    return this.authService.searchCreator(name).pipe(
      map((response: any) => {
        if (response.creadores && response.creadores.length > 0) {
          return response.creadores
            .filter((creator: any) => creator.tipo === 'Podcaster')
            .map((podcaster: any) => ({
              name: podcaster.nombre_creador,
              image: podcaster.link_imagen
            }));
        } else {
          return [];
        }
      }),
      catchError(err => {
        console.error('Error al obtener podcasters:', err);
        return of([]);
      })
    );
  }
  
  getAlbums(name: string) {
    return this.authService.searchAlbum(name).pipe(
      map((response: any) => response.length > 0 ? response.map((album: any) => ({
        id: album.id_album,
        name: album.nombre_album,
        image: album.link_imagen,
        date: album.fecha_pub,
        artist: album.artista
      })) : []),
      catchError(err => {
        console.error('Error al obtener álbumes:', err);
        return of([]);
      })
    );
  }
  
  getPodcasts(name: string) {
    return this.authService.searchPodcast(name).pipe(
      map((response: any) => response.podcasts?.length > 0 ? response.podcasts.map((podcast: any) => ({
        id: podcast.id_podcast,
        name: podcast.nombre,
        image: podcast.link_imagen
      })) : []),
      catchError(err => {
        console.error('Error al obtener podcasts:', err);
        return of([]);
      })
    );
  }
  
  getCanciones(name: string) {
    return this.authService.searchMultimedia(name).pipe(
      map((response: any) => response.top10Completo?.length > 0 ? response.top10Completo
        .filter((item: any) => item.tipo === 'Canción')
        .map((song: any) => ({
          id: song.id_cm,
          title: song.titulo,
          artist: song.cantante || 'Desconocido',
          image: song.link_imagen,
          duration: song.duracion,
          releaseDate: song.fecha_pub
        })) : []),
      catchError(err => {
        console.error('Error al obtener canciones:', err);
        return of([]);
      })
    );
  }
  
  getEpisodios(name: string) {
    return this.authService.searchMultimedia(name).pipe(
      map((response: any) => response.top10Completo?.length > 0 ? response.top10Completo
        .filter((item: any) => item.tipo === 'Episodio')
        .map((episode: any) => ({
          id: episode.id_cm,
          title: episode.titulo,
          podcast: episode.podcast || 'Desconocido',
          image: episode.link_imagen,
          duration: episode.duracion,
          releaseDate: episode.fecha_pub
        })) : []),
      catchError(err => {
        console.error('Error al obtener episodios:', err);
        return of([]);
      })
    );
  }


  getListas(name: string) {
    return this.authService.searchListas(name).pipe(
      map((response: any) => {
        if (response.listas && response.listas.length > 0) {
          return response.listas
            .filter((lista: any) => 
              !/^this is/i.test(lista.nombre) && //Excluir listas que empiecen con "This is"
              lista.nombre !== "Tus canciones favoritas" && //Excluir "Tus canciones favoritas"
              lista.nombre !== "Tus episodios favoritos" //Excluir "Tus episodios favoritos"
            )
            .map((lista: any) => ({
              id: lista.id_lista,
              name: lista.nombre,
              color: lista.color,
              shareLink: lista.link_compartir,
              similarity: lista.similitud,
              type: lista.tipo
            }));
        } else {
          return [];
        }
      }),
      catchError(err => {
        console.error('Error al obtener listas:', err);
        return of([]);
      })
    );
  }
  
  
  
  getUsuarios(name: string) {
    return this.authService.searchUsuarios(name).pipe(
      map((response: any) => response.usuarios?.length > 0 ? response.usuarios.map((usuario: any) => ({
        name: usuario.nombre_usuario,
        email: usuario.correo,
        shareLink: usuario.link_compartir
      })) : []),
      catchError(err => {
        console.error('Error al obtener usuarios:', err);
        return of([]);
      })
    );
  }

  encodeNombreArtista(nombre: string): string {
    return encodeURIComponent(nombre);
  }

  getRouterLinkMultimedia(contenido: any): string[] {
    if (contenido.tipo === 'Canción') {
      return ['/inicio/cancion/', contenido.id];
    } else if (contenido.tipo === 'Episodio') {
      return ['/inicio/episodio/', contenido.id];
    }
    return ['/inicio']; // Ruta por defecto si el tipo no es válido
  } 
  
}
