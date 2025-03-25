import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { FormsModule } from '@angular/forms'; // Importar FormsModule

@Component({
  selector: 'app-editar-perfil',
  standalone: true, // Importante si usas standalone components
  imports: [FormsModule], // Importar aquí FormsModule
  template: `
    <div class="h-screen flex items-center justify-center bg-black">
      <div class="w-[600px] h-[500px] p-6 rounded-[20px] bg-[var(--spongedark)] relative text-white text-center flex flex-col justify-between">

        <!-- Título -->
        <div class="relative mt-8">
          <h2 class="text-2xl font-bold">{{ nombreUsuario }}</h2>
          <p class="text-sm">Datos personales</p>
        </div>

        <!-- Información editable -->
        <div class="relative space-y-6">
          <!-- Campo Correo -->
          <div>
            <p class="text-sm font-semibold mb-2">Correo electrónico</p>
            <input [(ngModel)]="correo" 
              type="email" 
              class="w-full bg-[var(--sponge)] border border-white rounded-full px-4 py-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-white" />
          </div>

          <!-- Campo Contraseña -->
          <div>
            <p class="text-sm font-semibold mb-2">Contraseña</p>
            <input [(ngModel)]="contrasena" 
              type="password" 
              class="w-full bg-[var(--sponge)] border border-white rounded-full px-4 py-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-white" />
          </div>
        </div>

        <!-- Botón -->
        <div class="relative">
          <button (click)="guardarCambios()" 
            class="border-2 border-white rounded-full flex items-center px-6 py-2 justify-center hover:bg-white hover:text-[var(--spongedark)] transition mx-auto">
            <p class="font-montserrat font-bold text-sm">Guardar cambios</p>
          </button>
        </div>

      </div>
    </div>
  `,
  styles: ``
})
export class EditarPerfilComponent implements OnInit {
  nombreUsuario: string = 'Cargando...';
  correo: string = 'Cargando...';
  contrasena: string = '********';

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    const usuario = this.usuarioService.getUsuario();
    this.nombreUsuario = usuario ? usuario.nombre : 'Usuario desconocido';
    this.correo = usuario ? usuario.correo : 'Correo desconocido';
    this.contrasena = usuario ? usuario.contraseña : 'Contraseña desconocida';
  }

  guardarCambios() {
    // // Aquí podrías hacer la lógica para enviar los datos al backend
    // console.log('Nuevo correo:', this.correo);
    // console.log('Nueva contraseña:', this.contraseña);

    // // Ejemplo de actualizar en servicio (si lo tienes así)
    // this.usuarioService.actualizarUsuario({
    //   nombre: this.nombreUsuario,
    //   correo: this.correo,
    //   contraseña: this.contraseña
    // });
  }
}
