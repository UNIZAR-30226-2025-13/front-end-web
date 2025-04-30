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





  `,
  styles: ``
})
export class EditarAlbumComponent {




  eliminarAlbum() {}


}
