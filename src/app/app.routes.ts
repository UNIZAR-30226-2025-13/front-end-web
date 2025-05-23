import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { MarcoComponent } from './pages/marco/marco.component';
import { MarcoAdminComponent } from './pages/marco-admin/marco-admin.component';
import { TodoComponent } from './pages/todo/todo.component';
import { ArtistaComponent } from './pages/artista/artista.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { PodcasterComponent } from './pages/podcaster/podcaster.component';
import { ListaPodcastComponent } from './pages/lista-podcasts/lista_podcast.component';
import { AlbumComponent } from './pages/album/album.component';
import { CancionComponent } from './pages/cancion/cancion.component';
import { ListaReproducionesComponent } from './pages/lista-reproduciones/lista-reproduciones.component';
import { CarpetasComponent } from './pages/carpetas/carpetas.component';
import { BuscadorComponent } from './pages/buscador/buscador.component';
import { PerfilUsuarioComponent } from './pages/perfil-usuario/perfil-usuario.component';
import { DatospersonalesComponent } from './pages/datospersonales/datospersonales.component';
import { LyricsComponent } from './pages/lyrics/lyrics.component';

import { EpisodioComponent } from './pages/episodio/episodio.component';
import { ChatComponent } from './pages/chat/chat.component';
import { EditarPerfilComponent } from './pages/editar-perfil/editar-perfil.component';


import { AdminComponent } from './pages/admin/admin.component';
import { GestionarArtistasComponent } from './pages/gestionar-artistas/gestionar-artistas.component';
import { NuevoArtistaComponent } from './pages/nuevo-artista/nuevo-artista.component';
import { EditarArtistaComponent } from './pages/editar-artista/editar-artista.component';
import { GestionarPodcastersComponent } from './pages/gestionar-podcasters/gestionar-podcasters.component';
import { NuevoPodcasterComponent } from './pages/nuevo-podcaster/nuevo-podcaster.component';
import { EditarPodcasterComponent } from './pages/editar-podcaster/editar-podcaster.component';
import { GestionarAlbumesComponent } from './pages/gestionar-albumes/gestionar-albumes.component';
import { NuevoAlbumComponent } from './pages/nuevo-album/nuevo-album.component';
import { EditarAlbumComponent } from './pages/editar-album/editar-album.component';
import { GestionarPodcastsComponent } from './pages/gestionar-podcasts/gestionar-podcasts.component';
import { NuevoPodcastComponent } from './pages/nuevo-podcast/nuevo-podcast.component';
import { EditarPodcastComponent } from './pages/editar-podcast/editar-podcast.component';
import { GestionarCancionesComponent } from './pages/gestionar-canciones/gestionar-canciones.component';
import { NuevoCancionComponent } from './pages/nuevo-cancion/nuevo-cancion.component';
import { EditarCancionComponent } from './pages/editar-cancion/editar-cancion.component';
import { GestionarEpisodiosComponent } from './pages/gestionar-episodios/gestionar-episodios.component';
import { NuevoEpisodioComponent } from './pages/nuevo-episodio/nuevo-episodio.component';
import { EditarEpisodioComponent } from './pages/editar-episodio/editar-episodio.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'Iniciar Sesión | Spongefy'},
  { path: 'register', component: RegisterComponent, title: 'Registrarse | Spongefy'},
  { path: 'change-password', component: ChangePasswordComponent, title: 'Cambiar Contraseña | Spongefy'},
  { path: 'forgot-password', component: ForgotPasswordComponent, title: 'Cambiar Contraseña | Spongefy'},
  { path: 'inicio', 
    component: MarcoComponent,
    children: [
      { path: '', component: TodoComponent, title: 'Inicio | Spongefy' },
      { path: 'artista/:nombre_artista', component: ArtistaComponent },
      { path: 'podcaster/:nombre_podcaster', component: PodcasterComponent },
      { path: 'album/:id_album', component: AlbumComponent },
      { path: 'cancion/:id_cancion', component: CancionComponent },
      { path: 'podcast/:id_podcast', component: ListaPodcastComponent},
      { path: 'lista_reproduccion/:id_lista', component: ListaReproducionesComponent},
      { path: 'carpeta/:id_carpeta', component: CarpetasComponent},
      { path: 'buscador', component: BuscadorComponent},
      { path: 'usuario/:nombre_usuario', component: PerfilUsuarioComponent},
      { path: 'datospersonales/:nombre_usuario', component: DatospersonalesComponent},
      { path: 'episodio/:id_ep', component: EpisodioComponent},
      { path: 'lyrics/:id_ep', component: LyricsComponent},
      { path: 'editarperfil/:nombre_usuario', component: EditarPerfilComponent},
      { path: 'lyrics/:id_ep', component: LyricsComponent},
      { path: 'chat', component: ChatComponent},
    ]
  },

  { path: 'admin',
    component: MarcoAdminComponent,
    children: [
      { path: '', component: AdminComponent, title: 'Administrador | Spongefy'},
      { path: 'gestionar-artistas', component: GestionarArtistasComponent},
      { path: 'gestionar-artistas/nuevo', component: NuevoArtistaComponent},
      { path: 'gestionar-artistas/editar/:nombre', component: EditarArtistaComponent},
      { path: 'gestionar-podcasters', component: GestionarPodcastersComponent},
      { path: 'gestionar-podcasters/nuevo', component: NuevoPodcasterComponent},
      { path: 'gestionar-podcasters/editar/:nombre', component: EditarPodcasterComponent},
      { path: 'gestionar-albumes', component: GestionarAlbumesComponent},
      { path: 'gestionar-albumes/nuevo', component: NuevoAlbumComponent},
      { path: 'gestionar-albumes/editar/:id_album', component: EditarAlbumComponent},
      { path: 'gestionar-podcasts', component: GestionarPodcastsComponent},
      { path: 'gestionar-podcasts/nuevo', component: NuevoPodcastComponent},
      { path: 'gestionar-podcasts/editar/:id_podcast', component: EditarPodcastComponent},
      { path: 'gestionar-canciones', component: GestionarCancionesComponent},
      { path: 'gestionar-canciones/nuevo', component: NuevoCancionComponent},
      { path: 'gestionar-canciones/editar/:id_cancion', component: EditarCancionComponent},
      { path: 'gestionar-episodios', component: GestionarEpisodiosComponent},
      { path: 'gestionar-episodios/nuevo', component: NuevoEpisodioComponent},
      { path: 'gestionar-episodios/editar/:id_episodio', component: EditarEpisodioComponent},
    ]
  },


  
  

];