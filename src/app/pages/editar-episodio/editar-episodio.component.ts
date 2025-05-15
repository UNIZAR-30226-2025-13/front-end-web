import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editar-episodio',
  imports: [CommonModule, FormsModule, RouterModule],
  template: `

    <div class="min-h-screen bg-black text-white pt-8">
      <!-- Banner superior morado -->
      <div class="bg-[var(--sponge)] text-white px-8 py-4 flex items-center justify-between mb-8 h-[92px]">
        <div class="flex items-center gap-4">
          <img src="assets/episodios.png" class="w-8 h-8" alt="Icono episodios" />
          <h1 class="text-3xl uppercase tracking-wide font-semibold">EPISODIOS</h1>
        </div>
      </div>

      <div class="flex flex-col items-center justify-center bg-black text-white p-6">
        <h2 class="text-2xl font-bold mb-6 relative w-full flex justify-center">
          EDITAR EPISODIO
          <img 
            src="assets/papelera.png" 
            alt="Eliminar" 
            class="absolute right-175 top-0 w-8 h-8 cursor-pointer hover:opacity-80"
            (click)="eliminarEpisodio()"
          />
        </h2>

        <form (ngSubmit)="guardarEpisodio()" #episodioForm="ngForm" class="flex flex-col items-center gap-6">
          <div class="flex gap-8 items-start">

            <!-- COLUMNA 1: Audio y descripción -->
            <div class="flex flex-col items-center gap-4">
              <!-- Audio -->
              <div class="bg-[var(--button)] w-60 h-60 rounded-xl flex items-center justify-center cursor-pointer" (click)="audioInput.click()">
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

              <!-- Descripción -->
              <textarea 
                [(ngModel)]="descripcion" 
                name="descripcion" 
                required
                placeholder="Descripción"
                class="bg-[var(--button)] px-4 py-2 rounded-xl w-60 h-60 text-white placeholder:text-[var(--buttonhover)] text-xl outline-none resize-none">
              </textarea>
            </div>

            <!-- COLUMNA 2: Título, fecha publicación, id_podcast e idiomas -->
            <div class="flex flex-col gap-4">
              <input 
                [(ngModel)]="titulo" 
                name="titulo" 
                required 
                placeholder="Título"
                class="bg-[var(--button)] px-4 py-2 rounded-xl w-90 h-28 outline-none text-white placeholder:text-[var(--buttonhover)] text-xl" 
              />

              <input 
                type="date"  
                [(ngModel)]="fecha_pub" 
                name="fecha_pub" 
                required
                class="bg-[var(--button)] px-4 py-2 rounded-xl w-90 h-28 text-white placeholder-[var(--buttonhover)] text-xl outline-none" 
              />

              <input 
                [(ngModel)]="id_podcast" 
                name="id_podcast" 
                required 
                placeholder="Pódcast (ID)"
                class="bg-[var(--button)] px-4 py-2 rounded-xl w-90 h-28 outline-none text-white placeholder:text-[var(--buttonhover)] text-xl" 
              />

              <textarea 
                [(ngModel)]="idiomas" 
                name="idiomas" 
                placeholder="Idiomas (separados por comas)"
                class="bg-[var(--button)] px-4 py-2 rounded-xl w-90 h-28 text-white placeholder:text-[var(--buttonhover)] text-xl outline-none resize-none">
              </textarea>
          
            </div>

          </div>

          <!-- Botones -->
          <div class="flex gap-6 mt-4">
            <button type="button" (click)="cancelar()"
              class="bg-[var(--button)] hover:bg-[var(--buttonhover)] text-white py-2 px-6 text-xl rounded-full">
              Cancelar
            </button>
            <button type="submit" [disabled]="!episodioForm.form.valid || !audioSeleccionado"
              class="bg-[var(--sponge)] hover:bg-[var(--lightSponge)] text-white py-2 px-6 rounded-full font-semibold text-xl">
              Guardar
            </button>
          </div>
        </form>
      </div>

      <!-- Ventana de confirmación para eliminar -->
      <div *ngIf="mostrarModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div class="bg-black text-white p-6 rounded-2xl border-2 border-[var(--sponge)] w-[90%] max-w-md shadow-xl text-center animate-fade-in">
          <h2 class="text-xl font-semibold mb-4">¿Eliminar episodio?</h2>
          <p class="mb-6">¿Estás seguro de que deseas eliminar el episodio <strong>{{ this.titulo }}</strong>? Esta acción no se puede deshacer.</p>
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
export class EditarEpisodioComponent {

  id_ep: string = '';
  titulo: string = '';
  descripcion: string = '';
  fecha_pub: string = '';
  idiomas: string = '';
  id_podcast: string = '';

  audioSeleccionado: File | null = null;
  nombreAudio: string = '';

  mostrarModal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}


  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id_episodio');
    if (id) {
      this.id_ep = id;
      this.authService.getEpisode(+id).subscribe({
        next: (data: any) => {
          this.titulo = data.nombre_ep;
          this.fecha_pub = data.fecha_pub;
          this.id_podcast = data.id_podcast;
          this.descripcion = data.descripcion;
          this.idiomas = data.idioma;
        },
        error: (err) => {
          console.error('Error al obtener datos del episodio:', err);
          alert('No se pudieron cargar los datos del episodio.');
        }
      });
    }
  }

  onAudioSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.audioSeleccionado = file;
      this.nombreAudio = file.name;
    }
  }

  guardarEpisodio() {
    const formData = new FormData();
  
    formData.append('id', this.id_ep);

    if (this.titulo) {
      formData.append('titulo', this.titulo);
    }
    if (this.fecha_pub) {
      formData.append('fecha_pub', this.fecha_pub);
    }
    if (this.descripcion) {
      formData.append('descripcion', this.descripcion);
    }
    if (this.idiomas) {
      formData.append('idiomas', this.idiomas);
    }
    if (this.id_podcast) {
      console.log(this.id_podcast);
      formData.append('id_podcast', this.id_podcast);
    }
    if (this.audioSeleccionado) {
      formData.append('audio', this.audioSeleccionado);
    }
    formData.append('es_cancion', 'false');
  
    this.authService.updateMultimedia(formData).subscribe({
      next: () => {
        alert('Episodio modificado con éxito');
        this.router.navigate(['/admin/gestionar-episodios/']);
      },
      error: (err) => {
        console.error('Error al modificar episodio', err);
        alert('Ocurrió un error al guardar el episodio');
      }
    });    
  }


  eliminarEpisodio() {
    this.mostrarModal = true; 
  }

  confirmarEliminacion() {
    this.authService.eliminarMultimedia(Number(this.id_ep)).subscribe({
      next: () => {
        alert('Episodio eliminado correctamente.');
        this.router.navigate(['/admin/gestionar-episodios/']);
      },
      error: (error) => {
        console.error('Error al eliminar el episodio:', error);
        alert('Hubo un error al intentar eliminar el episodio.');
      }
    });
    this.mostrarModal = false;
  }

  cancelarEliminacion() {
    this.mostrarModal = false;
  }

  cancelar() {
    this.router.navigate(['/admin/gestionar-episodios/']);  
  }



}
