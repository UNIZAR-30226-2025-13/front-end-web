import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-editar-artista',
  imports: [RouterModule, CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-black text-white pt-8">
      <!-- Banner superior morado -->
      <div class="bg-[var(--sponge)] text-white px-8 py-4 flex items-center justify-between mb-8 h-[92px]">
        <div class="flex items-center gap-4">
          <img src="assets/artistas.png" class="w-8 h-8" alt="Icono artistas" />
          <h1 class="text-3xl uppercase tracking-wide font-semibold">ARTISTAS</h1>
        </div>
      </div>

      <div class="flex flex-col items-center justify-center bg-black text-white p-6">
        <h2 class="text-2xl font-bold mb-6 relative w-full flex justify-center">
          EDITAR ARTISTA
          <img 
            src="assets/papelera.png" 
            alt="Eliminar" 
            class="absolute right-160 top-0 w-8 h-8 cursor-pointer hover:opacity-80"
            (click)="eliminarArtista()"
          />
        </h2>

        <form (ngSubmit)="guardarArtista()" #artistForm="ngForm" class="flex flex-col items-center gap-6">
          <div class="flex gap-8 items-start">
            <!-- Columna izquierda: Imagen -->
            <div class="bg-[var(--button)] p-8 rounded-xl w-90 h-90 cursor-pointer" (click)="fileInput.click()">
              <div *ngIf="previewImage; else placeholder">
                <img [src]="previewImage" alt="Imagen de perfil" class="w-74 h-74 object-cover rounded-xl" />
              </div>
              <ng-template #placeholder>
                <div class="flex flex-col items-center justify-center h-full text-[var(--buttonhover)]">
                  <img src="assets/camera.png" alt="Camera" class="w-20 h-20 mb-2">
                  <p class="text-xl">Seleccionar</p>
                  <p class="text-xl">foto de perfil</p>
                </div>
              </ng-template>
              <input type="file" accept="image/*" (change)="onImageSelected($event)" #fileInput hidden>
            </div>

            <!-- Columna derecha: Nombre y Biografía -->
            <div class="flex flex-col gap-4">
              <!-- Nombre -->
              <input
                [(ngModel)]="nombre"
                name="nombre"
                readonly
                required
                placeholder="Nombre"
                class="bg-[var(--button)] px-4 py-2 rounded-xl w-90 h-15 outline-none text-white placeholder:text-[var(--buttonhover)] text-xl"
              />

              <!-- Biografía -->
              <textarea
                [(ngModel)]="biografia"
                name="biografia"
                required
                placeholder="Biografía"
                class="bg-[var(--button)] px-4 py-2 rounded-xl w-90 h-71 outline-none text-white placeholder:text-[var(--buttonhover)] text-xl resize-none"
              ></textarea>
            </div>
          </div>

          <!-- Botones -->
          <div class="flex gap-4 mt-4">
            <button type="button" (click)="cancelar()" class="bg-[var(--button)] hover:bg-[var(--buttonhover)] text-white py-2 px-6 rounded-full text-xl">
              Cancelar
            </button>
            <button type="submit" [disabled]="!artistForm.form.valid"
              class="bg-[var(--sponge)] hover:bg-[var(--lightSponge)] text-white py-2 px-6 rounded-full font-semibold text-xl">
              Guardar
            </button>
          </div>
        </form>
      </div>

      <!-- Ventana de confirmación para eliminar -->
      <div *ngIf="mostrarModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div class="bg-black text-white p-6 rounded-2xl border-2 border-[var(--sponge)] w-[90%] max-w-md shadow-xl text-center animate-fade-in">
          <h2 class="text-xl font-semibold mb-4">¿Eliminar artista?</h2>
          <p class="mb-6">¿Estás seguro de que deseas eliminar a <strong>{{ nombre }}</strong>? Esta acción no se puede deshacer.</p>
          <div class="flex justify-center gap-4">
            <button (click)="cancelarEliminacion()" class="bg-[var(--button)] hover:bg-[var(--buttonhover)] text-white px-6 py-2 rounded-full">
              Cancelar
            </button>
            <button (click)="confirmarEliminacion()" class="bg-[var(--sponge)] hover:bg-[var(--lightSponge)] text-white px-6 py-2 rounded-full font-semibold">
              Sí, eliminar
            </button>
            
          </div>
        </div>
      </div>


    </div>

  `,
  styles: ``
})
export class EditarArtistaComponent {
  nombre: string = '';
  biografia: string = '';
  imagenSeleccionada: File | null = null;
  previewImage: string | ArrayBuffer | null = null;

  mostrarModal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const nombreArtista = this.route.snapshot.paramMap.get('nombre');
    if (nombreArtista) {
      this.authService.getArtist(nombreArtista).subscribe((data) => {
        this.nombre = data.nombre_artista;
        this.biografia = data.biografia;
        this.previewImage = data.link_imagen;
      });
    }
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imagenSeleccionada = input.files[0];

      const reader = new FileReader();
      reader.onload = e => this.previewImage = reader.result;
      reader.readAsDataURL(this.imagenSeleccionada);
    }
  }

  guardarArtista(){
    const formData = new FormData();
  
    formData.append('nombre_creador', this.nombre);
  
    if (this.biografia) {
      formData.append('biografia', this.biografia);
    }
  
    if (this.imagenSeleccionada) {
      formData.append('imagen', this.imagenSeleccionada);
    }
  
    this.authService.updateCreador(formData).subscribe({
      next: () => {
        alert('Cambios guardados correctamente');
        this.router.navigate(['/gestionar-artistas/']); // Redirige al listado de artistas
      },
      error: (error) => {
        console.error('Error al guardar los cambios del artista:', error);
        alert('Ocurrió un error al guardar los cambios.');
      }
    });
  }

  eliminarArtista() {
    this.mostrarModal = true; // Muestra el modal
  }

  confirmarEliminacion() {
    this.authService.eliminarCreador(this.nombre).subscribe({
      next: () => {
        alert('Artista eliminado correctamente.');
        this.router.navigate(['/gestionar-artistas']);
      },
      error: (error) => {
        console.error('Error al eliminar el artista:', error);
        alert('Hubo un error al intentar eliminar el artista.');
      }
    });
    this.mostrarModal = false;
  }

  cancelarEliminacion() {
    this.mostrarModal = false;
  }
  

  cancelar() {
    this.router.navigate(['/gestionar-artistas/']); 
  }
  
}
