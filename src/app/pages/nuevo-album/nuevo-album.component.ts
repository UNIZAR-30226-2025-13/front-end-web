import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nuevo-album',
  imports: [RouterModule, CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-black text-white pt-8">
      <!-- Header -->
      <div class="bg-[var(--sponge)] text-white px-8 py-4 flex items-center justify-between mb-8 h-[92px]">
        <div class="flex items-center gap-4">
          <img src="assets/albumes.png" class="w-8 h-8" alt="Icono álbumes" />
          <h1 class="text-3xl uppercase tracking-wide font-semibold">ÁLBUMES</h1>
        </div>
      </div>

      <!-- Formulario -->
      <div class="flex flex-col items-center justify-center text-white p-6">
        <h2 class="text-2xl font-bold mb-6">NUEVO ÁLBUM</h2>

        <form (ngSubmit)="guardarAlbum()" #albumForm="ngForm" class="flex flex-col items-center gap-6">
          <div class="flex gap-8 items-start">
            <!-- Selección de imagen -->
            <div class="bg-[var(--button)] p-8 rounded-xl w-90 h-90 cursor-pointer" (click)="fileInput.click()">
              <div *ngIf="previewImage; else placeholder">
                <img [src]="previewImage" alt="Portada del álbum" class="w-74 h-74 object-cover rounded-xl" />
              </div>

              <ng-template #placeholder>
                <div class="flex flex-col items-center justify-center h-full text-[var(--buttonhover)]">
                  <img src="assets/camera.png" alt="Camera" class="w-20 h-20 mb-2">
                  <p class="text-xl">Seleccionar</p>
                  <p class="text-xl">portada de álbum</p>
                </div>
              </ng-template>
              <input type="file" accept="image/*" (change)="onImageSelected($event)" #fileInput hidden />
            </div>

            <!-- Campos de texto -->
            <div class="flex flex-col gap-4">
              <input
                [(ngModel)]="nombre"
                name="nombre"
                required
                placeholder="Nombre"
                class="bg-[var(--button)] px-4 py-2 rounded-xl w-90 h-15 text-white placeholder-[var(--buttonhover)] text-xl outline-none"
              />

              <input
                type="date"
                [(ngModel)]="fecha_pub"
                name="fecha_pub"
                required
                class="bg-[var(--button)] px-4 py-2 rounded-xl w-90 h-15 text-white placeholder-[var(--buttonhover)] text-xl outline-none"
              />

              <textarea
                [(ngModel)]="creadores"
                name="creadores"
                required
                placeholder="Creadores (separados por comas)"
                class="bg-[var(--button)] px-4 py-2 rounded-xl w-90 h-52 text-white placeholder:text-[var(--buttonhover)] text-xl outline-none resize-none"
              ></textarea>
            </div>
          </div>
        </form>

        <!-- Botones -->
        <div class="flex gap-6 mt-8">
          <button type="button" (click)="cancelar()" class="bg-[var(--button)] text-white px-6 py-2 rounded-full text-lg hover:bg-[var(--buttonhover)]">
            Cancelar
          </button>
          <button type="submit" (click)="guardarAlbum()" class="bg-[var(--sponge)] text-white px-6 py-2 rounded-full text-lg font-semibold hover:bg-[var(--lightSponge)]">
            Guardar
          </button>
        </div>
      </div>
    </div>


  `,
  styles: ``
})
export class NuevoAlbumComponent {
  nombre: string = '';
  fecha_pub: string = '';
  creadores: string = '';
  imagenArchivo!: File;
  previewImage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagenArchivo = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  guardarAlbum() {
    if (!this.imagenArchivo || !this.nombre || !this.creadores || !this.fecha_pub) {
      alert('Por favor completa todos los campos.');
      return;
    }

    const formData = new FormData();
    formData.append('nombre_album', this.nombre);
    formData.append('fecha_pub', this.fecha_pub);
    formData.append('creadores', this.creadores);
    formData.append('imagen', this.imagenArchivo);

    this.authService.uploadAlbum(formData).subscribe({
      next: () => {
        alert('Álbum creado con éxito');
        this.router.navigate(['/admin/gestionar-albumes']);
      },
      error: (error) => {
        console.error('Error al subir álbum:', error);
        alert('Hubo un error al guardar el álbum.');
      }
    });
  }

  cancelar() {
    this.router.navigate(['/admin/gestionar-albumes']);
  }

}
