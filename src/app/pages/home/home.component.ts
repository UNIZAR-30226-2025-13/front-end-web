import { Component, HostListener } from '@angular/core'; 
import { UsuarioService } from '../../services/usuario.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  imports: [RouterModule],
  template: `
  <div class="bg-black">
    <div class="flex flex-row bg-black border-b-[3px] border-r-[3px] border-l-[3px] border-[var(--sponge)] w-full h-[90px] rounded-bl-[40px] rounded-br-[40px] justify-between items-center">
      <!-- Parte izquierda -->
      <div class="flex flex-row items-center ml-7 min-w-9">
        <img src="assets/play.png" class="w-9 h-9">
      </div>

      <!-- Parte central -->
      <div class="flex flex-row items-center space-x-4">
        <!-- Icono de casa fuera del buscador -->
        <div (click)="router.navigate(['/inicio'])"class="text-white max-sm:hidden">
          <img src="assets/home.png" class="w-9 h-9">
        </div>

        <!-- Barra de búsqueda funcional -->
        <div class="flex flex-row bg-[#1a1a1a] w-[400px] h-[50px] rounded-full items-center max-sm:w-[300px]">
            <!-- Icono de búsqueda -->
            <div class="text-white">
              <img src="assets/search.png" class="w-12 h-12">
            </div>
            <!-- Input de búsqueda -->
            <input 
                type="text" 
                placeholder="Buscar..." 
                class="flex-grow bg-transparent text-white placeholder-gray-500 outline-none"
            />
        </div>
    </div>

      <!-- Parte derecha -->
      <div class="flex flex-row mr-7 items-center gap-5">
        <img src="assets/friends.png" class="w-9 h-9 max-sm:hidden">
        
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
              <h3 class="text-xl font-bold mt-2 mb-8 text-center">Tu Perfil</h3>
              <hr class="border-gray-500 mb-4">

              <ul class="space-y-2">
                <li (click)="verPerfil()" class="px-4 py-2 hover:bg-[var(--buttonhover)]/10 cursor-pointer rounded-lg font-semibold">
                  Editar Perfil
                </li>
                <li (click)="cerrarSesion()" class="px-4 py-2 hover:bg-[var(--buttonhover)]/10 cursor-pointer rounded-lg font-semibold">
                  Cerrar Sesión
                </li>
                <li (click)="eliminarPerfil()" class="px-4 py-2 hover:bg-red-600/10 text-red-400 cursor-pointer rounded-lg font-semibold">
                  Eliminar Cuenta
                </li>
              </ul>
            </div>
           }
        </div>
      </div>
    </div>
  </div>
  `,
  styles: ``
})
export class HomeComponent {
  dropdownOpen = false;
  usuarioInfo: any;

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    public router: Router
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
  verPerfil() {
    this.closeDropdown();
    this.router.navigate(['/perfil']);
  }

  cerrarSesion() {
    this.closeDropdown();
    this.usuarioService.limpiarUsuario();
    this.router.navigate(['/login']);
  }

  eliminarPerfil() {
    const deleteData = { nombre_usuario: this.usuarioInfo.nombre_usuario};
    this.closeDropdown();
    if (confirm('¿Estás seguro de que deseas eliminar tu perfil? Esta acción no se puede deshacer.')) {
      this.authService.deleteUser(deleteData).subscribe({
        next: (response: any) => {
          console.log('Se ha borrado el usuario correctamente', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error al borrar la cuenta ' + this.usuarioInfo.nombre_usuario, error);
          alert('No se ha podido eliminar su cuenta')
        }
      });
    }
  }
}
