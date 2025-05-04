import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-editar-album',
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
        <div class="flex flex-col items-center justify-center bg-black text-white p-6">
          <h2 class="text-2xl font-bold mb-6 relative w-full flex justify-center">
            EDITAR ÁLBUM
            <img 
              src="assets/papelera.png" 
              alt="Eliminar" 
              class="absolute right-160 top-0 w-8 h-8 cursor-pointer hover:opacity-80"
              (click)="eliminarAlbum()"
            />
          </h2>

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

    <!-- Ventana de confirmación para eliminar -->
    <div *ngIf="mostrarModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div class="bg-black text-white p-6 rounded-2xl border-2 border-[var(--sponge)] w-[90%] max-w-md shadow-xl text-center animate-fade-in">
        <h2 class="text-xl font-semibold mb-4">¿Eliminar álbum?</h2>
        <p class="mb-6">¿Estás seguro de que deseas eliminar el álbum <strong>{{ nombre }}</strong>? Esta acción no se puede deshacer.</p>
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

  `,
  styles: ``
})
export class EditarAlbumComponent {
  idAlbum: number = 0;
  nombre: string = '';
  fecha_pub: string = '';
  creadores: string = '';
  imagenArchivo!: File;
  previewImage: string | null = null;

  mostrarModal: boolean = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}



  ngOnInit() {
    const idAlbum = Number(this.route.snapshot.paramMap.get('id_album'));
    if (idAlbum) {
      this.authService.getInfoAlbum(idAlbum).subscribe((data: any) => {
        this.nombre = data.album.nombre;
        this.idAlbum = data.album.id;
        this.fecha_pub = data.album.fecha_pub;
        this.creadores = data.artista;
        this.previewImage = data.album.link_imagen;
      });
    }
  }

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


  guardarAlbum(){
    const formData = new FormData();

    formData.append('id_album', this.idAlbum.toString());
  
    if (this.nombre) {
      formData.append('nombre_album', this.nombre);
    }
  
    if (this.fecha_pub) {
      formData.append('fecha_pub', this.fecha_pub);
    }

    if (this.creadores) {
      formData.append('creadores', this.creadores);
    }
  
    if (this.imagenArchivo) {
      formData.append('imagen', this.imagenArchivo);
    }
  
    this.authService.updateAlbum(formData).subscribe({
      next: () => {
        alert('Cambios guardados correctamente');
        this.router.navigate(['/admin/gestionar-albumes/']); 
      },
      error: (error) => {
        console.error('Error al guardar los cambios del álbum:', error);
        alert('Ocurrió un error al guardar los cambios.');
      }
    });
  }

  eliminarAlbum() {
    this.mostrarModal = true; // Muestra el modal
  }


  confirmarEliminacion() {
    this.authService.eliminarAlbum(this.idAlbum).subscribe({
      next: () => {
        alert('Álbum eliminado correctamente.');
        this.router.navigate(['/admin/gestionar-albumes']);
      },
      error: (error) => {
        console.error('Error al eliminar el álbum:', error);
        alert('Hubo un error al intentar eliminar el álbum.');
      }
    });
    this.mostrarModal = false;
  }

  cancelarEliminacion() {
    this.mostrarModal = false;
  }
  

  cancelar() {
    this.router.navigate(['/admin/gestionar-albumes/']); 
  }

}
