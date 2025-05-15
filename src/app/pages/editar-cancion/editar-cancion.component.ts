import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editar-cancion',
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-black text-white pt-8">
      <!-- Banner superior morado -->
      <div class="bg-[var(--sponge)] text-white px-8 py-4 flex items-center justify-between mb-8 h-[92px]">
        <div class="flex items-center gap-4">
          <img src="assets/canciones.png" class="w-8 h-8" alt="Icono canciones" />
          <h1 class="text-3xl uppercase tracking-wide font-semibold">CANCIONES</h1>
        </div>
      </div>

      <div class="flex flex-col items-center justify-center bg-black text-white p-6">
        <h2 class="text-2xl font-bold mb-6 relative w-full flex justify-center">
          EDITAR CANCIÓN
          <img 
            src="assets/papelera.png" 
            alt="Eliminar" 
            class="absolute right-160 top-0 w-8 h-8 cursor-pointer hover:opacity-80"
            (click)="eliminarCancion()"
          />
        </h2>

        <form (ngSubmit)="guardarCancion()" #cancionForm="ngForm" class="flex flex-col items-center gap-6">
          <div class="flex gap-8 items-start">

            <!-- COLUMNA 1: Imagen y audio -->
            <div class="flex flex-col items-center gap-4">
              <!-- Imagen --> 
              <div class="bg-[var(--button)] p-4 rounded-xl w-58 h-58 cursor-pointer" (click)="fileInput.click()">
                <div *ngIf="previewImage; else placeholder">
                  <img [src]="previewImage" alt="Portada de cancion" class="w-50 h-50 object-cover rounded-xl" />
                </div>
                <ng-template #placeholder>
                  <div class="flex flex-col items-center justify-center h-full text-[var(--buttonhover)]">
                    <img src="assets/camera.png" alt="Camera" class="w-15 h-15 mb-2">
                    <p class="text-xl">Seleccionar</p>
                    <p class="text-xl">portada</p>
                    <p class="text-xl">de canción</p>
                  </div>
                </ng-template>
                <input type="file" accept="image/*" (change)="onImageSelected($event)" #fileInput hidden>
              </div>

              <!-- Audio -->
              <div class="bg-[var(--button)] w-58 h-58 rounded-xl flex items-center justify-center cursor-pointer" (click)="audioInput.click()">
                <div *ngIf="nombreAudio; else audioPlaceholder" class="text-center px-2">
                  <p class="text-sm break-words max-w-[13rem]">{{ nombreAudio }}</p>
                </div>
                <ng-template #audioPlaceholder>
                  <div class="flex flex-col items-center text-[var(--buttonhover)]">
                    <img src="assets/audio.png" alt="Audio" class="w-15 h-15 mb-1" />
                    <p class="text-xl">Seleccionar</p>
                    <p class="text-xl">archivo</p>
                    <p class="text-xl">de audio</p>
                  </div>
                </ng-template>
                <input type="file" accept="audio/*" (change)="onAudioSelected($event)" #audioInput hidden>
              </div>
            </div>
            <!-- COLUMNA 2: Título, creador principal y fecha publicación -->
            <div class="flex flex-col gap-4">
              <input 
                [(ngModel)]="titulo" 
                name="titulo" 
                required 
                placeholder="Título"
                class="bg-[var(--button)] px-4 py-2 rounded-xl w-90 h-27 outline-none text-white placeholder:text-[var(--buttonhover)] text-xl" 
              />

              <input 
                [(ngModel)]="creador" 
                name="creador" 
                required 
                placeholder="Creador principal"
                class="bg-[var(--button)] px-4 py-2 rounded-xl w-90 h-27 outline-none text-white placeholder:text-[var(--buttonhover)] text-xl" 
              />

              <input 
                [(ngModel)]="id_album" 
                name="id_album" 
                required 
                placeholder="Álbum (ID)"
                class="bg-[var(--button)] px-4 py-2 rounded-xl w-90 h-27 outline-none text-white placeholder:text-[var(--buttonhover)] text-xl" 
              />

              <input 
                type="date"  
                [(ngModel)]="fecha_pub" 
                name="fecha_pub" 
                required
                class="bg-[var(--button)] px-4 py-2 rounded-xl w-90 h-27 text-white placeholder-[var(--buttonhover)] text-xl outline-none" 
              />
            </div>

            <!-- COLUMNA 3: Featurings, generos e idiomas -->
            <div class="flex flex-col gap-4">
              <textarea 
                [(ngModel)]="featurings" 
                name="featurings"
                placeholder="Featurings (separados por comas)"
                class="bg-[var(--button)] px-4 py-2 rounded-xl w-90 h-37 text-white placeholder:text-[var(--buttonhover)] text-xl outline-none resize-none">
              </textarea>

              <textarea 
                [(ngModel)]="generos" 
                name="generos" 
                placeholder="Géneros (separados por comas)"
                class="bg-[var(--button)] px-4 py-2 rounded-xl w-90 h-37 text-white placeholder:text-[var(--buttonhover)] text-xl outline-none resize-none">
              </textarea>

              <textarea 
                [(ngModel)]="idiomas" 
                name="idiomas" 
                placeholder="Idiomas (separados por comas)"
                class="bg-[var(--button)] px-4 py-2 rounded-xl w-90 h-38 text-white placeholder:text-[var(--buttonhover)] text-xl outline-none resize-none">
              </textarea>
            </div>

            <!-- COLUMNA 4: Letra de la canción -->
            <div class="flex flex-col gap-4">
              <textarea 
                [(ngModel)]="letra" 
                name="letra" 
                required
                placeholder="Letra de la canción"
                class="bg-[var(--button)] px-4 py-2 rounded-xl w-90 h-120 text-white placeholder:text-[var(--buttonhover)] text-xl outline-none resize-none">
              </textarea>
            </div>

          </div>

          <!-- Botones -->
          <div class="flex gap-6 mt-4">
            <button type="button" (click)="cancelar()"
              class="bg-[var(--button)] hover:bg-[var(--buttonhover)] text-white py-2 px-6 text-xl rounded-full">
              Cancelar
            </button>
            <button type="submit" [disabled]="!cancionForm.form.valid || !imagenSeleccionada"
              class="bg-[var(--sponge)] hover:bg-[var(--lightSponge)] text-white py-2 px-6 rounded-full font-semibold text-xl">
              Guardar
            </button>
          </div>
        </form>
      </div>

      <!-- Ventana de confirmación para eliminar -->
      <div *ngIf="mostrarModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div class="bg-black text-white p-6 rounded-2xl border-2 border-[var(--sponge)] w-[90%] max-w-md shadow-xl text-center animate-fade-in">
          <h2 class="text-xl font-semibold mb-4">¿Eliminar canción?</h2>
          <p class="mb-6">¿Estás seguro de que deseas eliminar la canción <strong>{{ this.titulo }}</strong>? Esta acción no se puede deshacer.</p>
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
export class EditarCancionComponent {
  id_cancion: string = '';
  titulo: string = '';
  creador: string = '';
  fecha_pub: string = '';
  generos: string = '';
  featurings: string = '';
  idiomas: string = '';
  letra: string = '';
  id_album: string = '';

  imagenSeleccionada: File | null = null;
  previewImage: string | null = null;

  audioSeleccionado: File | null = null;
  nombreAudio: string = '';

  mostrarModal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id_cancion');
    if (id) {
      this.id_cancion = id;
      this.authService.showSong(+id).subscribe({
        next: (data: any) => {
          this.titulo = data.titulo;
          this.creador = data.autor;
          this.fecha_pub = data.fecha_pub;
          this.previewImage = data.link_imagen || null;
          this.generos = data.generos;
          this.featurings = data.artistas_featurings;
          this.idiomas = data.idiomas;
          
        },
        error: (err) => {
          console.error('Error al obtener datos de la canción:', err);
          alert('No se pudieron cargar los datos de la canción.');
        }
      });

      this.authService.showLyrics(+id).subscribe({
        next: (res: any) => {
          this.letra = res.letra;
        },
        error: (err) => {
          console.error('Error al obtener la letra de la canción:', err);
        }
      });

      this.authService.showCM(+id).subscribe({
        next: (res: any) => {
          this.id_album = res.id_album;
        },
        error: (err) => {
          console.error('Error al obtener el id_album de la canción:', err);
        }
      });

    }
  }
  

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

  onAudioSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.audioSeleccionado = file;
      this.nombreAudio = file.name;
    }
  }

  guardarCancion() {
    console.log("A");

    const formData = new FormData();
  
    formData.append('id', this.id_cancion);

    if (this.titulo) {
      formData.append('titulo', this.titulo);
    }
    if (this.creador) {
      formData.append('creador', this.creador);
    }
    if (this.fecha_pub) {
      formData.append('fecha_pub', this.fecha_pub);
    }
    if (this.letra) {
      formData.append('letra', this.letra);
    }
    if (this.featurings) {
      formData.append('featurings', this.featurings);
    }
    if (this.generos) {
      formData.append('generos', this.generos);
    }
    if (this.idiomas) {
      formData.append('idiomas', this.idiomas);
    }
    console.log("a" + this.id_album);
    if (this.id_album) {
      console.log(this.id_album);
      formData.append('id_album', this.id_album);  
    }
    if (this.imagenSeleccionada) {
      formData.append('imagen', this.imagenSeleccionada);
    }
    if (this.audioSeleccionado) {
      formData.append('audio', this.audioSeleccionado);
    }
    formData.append('es_cancion', 'true');
  
    this.authService.updateMultimedia(formData).subscribe({
      next: () => {
        alert('Canción modificada con éxito');
        this.router.navigate(['/admin/gestionar-canciones/']);
      },
      error: (err) => {
        console.error('Error al modificar canción', err);
        alert('Ocurrió un error al guardar la canción');
      }
    });    
  }
  

  
  eliminarCancion() {
    this.mostrarModal = true; 
  }

  confirmarEliminacion() {
    this.authService.eliminarMultimedia(Number(this.id_cancion)).subscribe({
      next: () => {
        alert('Canción eliminada correctamente.');
        this.router.navigate(['/admin/gestionar-artistas']);
      },
      error: (error) => {
        console.error('Error al eliminar la canción:', error);
        alert('Hubo un error al intentar eliminar la canción.');
      }
    });
    this.mostrarModal = false;
  }

  cancelarEliminacion() {
    this.mostrarModal = false;
  }

  cancelar() {
    this.router.navigate(['/admin/gestionar-canciones/']);  
  }



}
