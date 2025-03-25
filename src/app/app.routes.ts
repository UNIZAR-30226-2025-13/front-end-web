import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { MarcoComponent } from './pages/marco/marco.component';
import { TodoComponent } from './pages/todo/todo.component';
import { ArtistaComponent } from './pages/artista/artista.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { PodcasterComponent } from './pages/podcaster/podcaster.component';
import { ListaPodcastsComponent } from './pages/lista-podcasts/lista-podcasts.component';
import { AlbumComponent } from './pages/album/album.component';
import { CancionComponent } from './pages/cancion/cancion.component';
import { ListaReproducionesComponent } from './pages/lista-reproduciones/lista-reproduciones.component';
import { BuscadorComponent } from './pages/buscador/buscador.component';
import { PerfilUsuarioComponent } from './pages/perfil-usuario/perfil-usuario.component';

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
      { path: 'podcast/:id_podcast', component: ListaPodcastsComponent},
      { path: 'lista_reproduccion/:id_playlist', component: ListaReproducionesComponent},
      { path: 'buscador', component: BuscadorComponent},
      { path: 'usuario/:nombre_usuario', component: PerfilUsuarioComponent}

    ]
  },

];