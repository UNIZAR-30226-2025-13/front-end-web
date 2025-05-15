import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nuevo-episodio',
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
        <h2 class="text-2xl font-bold mb-6">NUEVO EPISODIO</h2>

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
                [(ngModel)]="id_podcast" 
                name="id_podcast" 
                required 
                placeholder="Pódcast (ID)"
                class="bg-[var(--button)] px-4 py-2 rounded-xl w-90 h-28 outline-none text-white placeholder:text-[var(--buttonhover)] text-xl" 
              />

              <input 
                type="date"  
                [(ngModel)]="fecha_pub" 
                name="fecha_pub" 
                required
                class="bg-[var(--button)] px-4 py-2 rounded-xl w-90 h-28 text-white placeholder-[var(--buttonhover)] text-xl outline-none" 
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


    </div>

  `,
  styles: ``
})
export class NuevoEpisodioComponent {

  titulo: string = '';
  descripcion: string = '';
  fecha_pub: string = '';
  idiomas: string = '';
  id_podcast: string = '';

  audioSeleccionado: File | null = null;
  nombreAudio: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onAudioSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.audioSeleccionado = file;
      this.nombreAudio = file.name;
    }
  }

  guardarEpisodio() {
    if (!this.titulo || !this.descripcion || !this.id_podcast || !this.fecha_pub || !this.audioSeleccionado) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const formData = new FormData();
    formData.append('audio', this.audioSeleccionado); 
    formData.append('descripcion', this.descripcion);
    formData.append('titulo', this.titulo);
    formData.append('es_cancion', 'false');
    formData.append('fecha_pub', this.fecha_pub);
    formData.append('idiomas', this.idiomas);
    formData.append('id_podcast', this.id_podcast);

    console.log(this.id_podcast);

    this.authService.uploadMultimedia(formData).subscribe({
      next: () => {
        alert('Episodio creado con éxito');
        this.router.navigate(['/admin/gestionar-episodios/']);
      },
      error: (err) => {
        console.error('Error al subir episodio', err);
        alert('Ocurrió un error al guardar el episodio');
      }
    });
  }

  cancelar() {
    this.router.navigate(['/admin/gestionar-episodios/']);  
  }

}
