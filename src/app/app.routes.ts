import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { MarcoComponent } from './pages/marco/marco.component';
import { InicioComponent } from './pages/inicio/inicio.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'Iniciar Sesión | Spongefy'},
  { path: 'register', component: RegisterComponent, title: 'Registrarse | Spongefy'},
  { path: 'forgot-password', component: ForgotPasswordComponent, title: 'Cambiar Contraseña | Spongefy'},
  { path: 'inicio',
    component: MarcoComponent,
    children: [
      { path: '', component: InicioComponent, title: 'Inicio | Spongefy' }
    ]
  },
];
