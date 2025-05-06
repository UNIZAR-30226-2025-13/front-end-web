import { Component, HostListener } from '@angular/core'; 
import { UsuarioService } from '../../services/usuario.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { BusquedaService } from '../../services/busqueda.service';
import { io } from 'socket.io-client';


@Component({
  selector: 'app-home-admin',
  imports: [RouterModule, FormsModule],
  template: `
  <div class="bg-black">
      <div class="flex flex-row bg-black border-b-[3px] border-r-[3px] border-l-[3px] border-[var(--sponge)] w-full h-[90px] rounded-bl-[40px] rounded-br-[40px] justify-between items-center">
        <!-- Parte izquierda -->
        <div class="flex flex-row items-center ml-7 min-w-9">
          <img (click)="router.navigate(['/admin'])" src="assets/home.png" class="w-9 h-9 cursor-pointer">
        </div>

        <!-- Parte central -->
        <div class="flex flex-row items-center space-x-4">
          <h1 class="text-3xl font-bold text-white">ADMIN</h1>
        </div>

        <!-- Parte derecha -->
        <div class="flex flex-row mr-7 items-center gap-5">

          <!-- Botón del usuario -->
          
          <div (click)="toggleDropdown()" class="relative cursor-pointer">
            @if (dropdownOpen) {
              <a 
              class="bg-white border-2 border-[var(--sponge)] w-9 h-9 rounded-3xl text-[var(--sponge)] flex items-center justify-center font-bold text-xl">
              {{usuarioInfo.nombre_usuario[0].toUpperCase() }}
              </a>
            } @else {
              <a 
                class="bg-[var(--sponge)] w-9 h-9 rounded-3xl text-white flex items-center justify-center font-bold text-xl">
                {{usuarioInfo.nombre_usuario[0].toUpperCase() }}
              </a>
            }

            <!-- Menú desplegable -->
            @if (dropdownOpen) {
              <div class="absolute mt-2 w-50 right-[-30px] bg-[#151515] rounded-tl-[40px] rounded-bl-[40px] shadow-lg z-50 text-white p-4">
                <h3 class="text-xl font-bold mt-2 mb-8 text-center" >Tu Perfil</h3>
                <hr class="border-gray-500 mb-4">

                <ul class="space-y-2">
                  <li (click)="cerrarSesion()" class="px-4 py-2 hover:bg-[var(--buttonhover)]/10 cursor-pointer rounded-[40px] font-semibold">
                    Cerrar Sesión
                  </li>
                  <!-- Botón que abre el modal -->
                  <li (click)="eliminarPerfil()" class="px-4 py-2 hover:bg-[var(--buttonhover)]/10 cursor-pointer rounded-[40px] font-semibold">
                    Eliminar Cuenta
                  </li>
                </ul>
              </div>
            }

            <!-- MODAL de confirmación de eliminación -->
            @if (mostrarModal) {
              <div class="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
                <!-- Contenedor principal -->
                <div class="flex h-[600px] w-[800px] max-md:w-[400px] max-md:h-[400px] bg-black rounded-3xl shadow-lg overflow-hidden">
                                  
                  <!-- Imagen en la mitad izquierda -->
                  <div class="hidden md:block md:w-1/2 relative">
                  <img src="assets/back.png" (click)="cerrarModal()" 
                    class="absolute top-4 left-4 hover:border-2 hover:bg-white text-white rounded-full w-8 h-8 flex items-center justify-center"/>
                    <img src="assets/mediologo.png" alt="Logo"
                      class="w-full h-full object-cover rounded-l-3xl">
                  </div>

                  <!-- Contenido del modal en la mitad derecha -->
                  <div class="w-full md:w-1/2 p-8 flex flex-col items-center justify-center">
                    <!-- Botón de cerrar dentro del modal -->
                    <h2 class="text-3xl font-bold text-white text-center mb-6">Eliminar Cuenta</h2>
                      <p class="text-center text-gray-400 mb-4">¿Estás seguro? Esta acción no se puede deshacer.</p>

                      <!-- Campo de Nombre de Usuario con Icono -->
                      <div class="relative w-full mb-4">
                        <span class="absolute inset-y-0 left-3 flex items-center text-black">
                          <img src="assets/user.png" alt="Usuario" class="w-5 h-5">
                        </span>
                        <input type="text" [(ngModel)]="usuarioConfirm" name="usuarioConfirm"
                          placeholder="Nombre de usuario"
                          class="w-full pl-10 p-3 rounded-3xl bg-gray-200 focus:outline-none">
                      </div>

                      <!-- Campo de Contraseña con Icono -->
                      <div class="relative w-full mb-4">
                        <span class="absolute inset-y-0 left-3 flex items-center text-black">
                          <img src="assets/password.png" alt="Contraseña" class="w-5 h-5">
                        </span>
                        <input type="password" [(ngModel)]="passwordConfirm" name="passwordConfirm"
                          placeholder="Contraseña"
                          class="w-full pl-10 p-3 rounded-3xl bg-gray-200 focus:outline-none">
                      </div>

                      <!-- Botón de Confirmar Eliminación -->
                      <button (click)="confirmarEliminacion()"
                        class="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-3xl font-bold">
                        Eliminar Cuenta
                      </button>

                      <button (click)="cerrarModal()"
                        class="hidden max-md:block w-full mt-4 bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-3xl font-bold">
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              }
          </div>
        </div>
      </div>
    </div>

  `,
  styles: ``
})
export class HomeAdminComponent {
  dropdownOpen = false;
  usuarioInfo: any;
  mostrarModal = false;
  usuarioConfirm = '';
  passwordConfirm = '';

  socket = io('https://spongefy-back-end.onrender.com', {withCredentials: true});

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    public router: Router,
    private busquedaService: BusquedaService
  ) {}

  ngOnInit() {
    this.usuarioInfo = this.usuarioService.getUsuario();
    if (!this.usuarioInfo) {
      alert('No has iniciado sesión.');
        this.router.navigate(['/login']);    
    }   
  }

  // Abre/cierra el menú desplegable
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Cierra el menú desplegable
  closeDropdown() {
    this.dropdownOpen = false;
  }

  // Detecta clic fuera del menú para cerrarlo
  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.closeDropdown();
    }
  }

  // Lógica para cada opción del menú
  cerrarSesion() {
    this.closeDropdown();
    this.router.navigate(['/login']);
  }

  // Método para abrir el modal
  eliminarPerfil() {
    this.mostrarModal = true;
  }

  // Método para cerrar el modal
  cerrarModal() {
    this.mostrarModal = false;
    this.usuarioConfirm = ''; 
    this.passwordConfirm = ''; 
  }

  confirmarEliminacion() {
    if (this.usuarioConfirm !== this.usuarioInfo.nombre_usuario) {
      alert('El nombre de usuario no coincide.');
      return;
    }

    const deleteData = { nombre_usuario: this.usuarioInfo.nombre_usuario };

    if (confirm('¿Estás seguro de que deseas eliminar tu perfil? Esta acción no se puede deshacer.')) {
      this.authService.deleteUser(deleteData).subscribe({
        next: () => {
          console.log('Se ha borrado el usuario correctamente');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error al borrar la cuenta', error);
          alert('No se ha podido eliminar su cuenta');
        }
      });
    }
  }

}
