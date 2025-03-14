import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { MarcoComponent } from './pages/marco/marco.component';
import { TodoComponent } from './pages/todo/todo.component';
import { ArtistaComponent } from './pages/artista/artista.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { PodcasterComponent } from './pages/podcaster/podcaster.component';
import { ListaReproduccionesComponent } from './pages/lista-reproducciones/lista-reproducciones.component';

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
      { path: 'podcaster/:nombre_artista', component: PodcasterComponent },
      { path: 'lista_reproduccion/:id', component: ListaReproduccionesComponent}
    ]
  },
];