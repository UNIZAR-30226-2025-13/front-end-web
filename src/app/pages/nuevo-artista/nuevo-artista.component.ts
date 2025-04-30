import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nuevo-artista',
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
        <h2 class="text-2xl font-bold mb-6">NUEVO ARTISTA</h2>

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

          <!-- Botones: Centrados debajo de las columnas -->
          <div class="flex gap-6 mt-4">
            <button type="button" (click)="cancelar()" class="bg-[var(--button)] hover:bg-[var(--buttonhover)] text-white py-2 px-6 text-xl rounded-full">
              Cancelar
            </button>
            <button type="submit" [disabled]="!artistForm.form.valid || !imagenSeleccionada"
              class="bg-[var(--sponge)] hover:bg-[var(--lightSponge)] text-white py-2 px-6 rounded-full font-semibold text-xl">
              Guardar
            </button>
          </div>
        </form>

      </div>


    </div>
  `,
  styles: ``
})
export class NuevoArtistaComponent {

  nombre: string = '';
  biografia: string = '';
  imagenSeleccionada: File | null = null;
  previewImage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.imagenSeleccionada = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  guardarArtista() {
    if (!this.nombre || !this.biografia || !this.imagenSeleccionada) {
      alert('Por favor, completa todos los campos y selecciona una imagen.');
      return;
    }

    const formData = new FormData();
    formData.append('nombre_creador', this.nombre);
    formData.append('biografia', this.biografia);
    formData.append('es_podcaster', 'false');
    formData.append('imagen', this.imagenSeleccionada);

    this.authService.uploadCreador(formData).subscribe({
      next: () => {
        alert('Artista creado con éxito');
        this.router.navigate(['/admin/gestionar-artistas/']);
      },
      error: (err) => {
        console.error('Error al subir artista', err);
        alert('Ocurrió un error al guardar el artista');
      }
    });
  }

  cancelar() {
    this.router.navigate(['/admin/gestionar-artistas/']);  // Vuelve a la página anterior
  }


}
