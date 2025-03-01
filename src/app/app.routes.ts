import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';

import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { MarcoComponent } from './pages/marco/marco.component';
import { TodoComponent } from './pages/todo/todo.component';
import { MusicaComponent } from './pages/musica/musica.component';
import { PodcastsComponent } from './pages/podcasts/podcasts.component';
import { ArtistaComponent } from './pages/artiste/artista.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'Iniciar Sesión | Spongefy'},
  { path: 'register', component: RegisterComponent, title: 'Registrarse | Spongefy'},
  { path: 'forgot-password', component: ForgotPasswordComponent, title: 'Cambiar Contraseña | Spongefy'},
  { path: 'inicio', 
    component: MarcoComponent,
    children: [
      { path: '', redirectTo: 'todo', pathMatch: 'full' },
      { path: 'todo', component: TodoComponent, title: 'Inicio | Spongefy' },
      { path: 'musica', component: MusicaComponent, title: 'Música | Spongefy' },
      { path: 'podcasts', component: PodcastsComponent, title: 'Pódcasts | Spongefy' },
      { path: 'artista/:nombre_artista', component: ArtistaComponent }
    ]
  },
];
