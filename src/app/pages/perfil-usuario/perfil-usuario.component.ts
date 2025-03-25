import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { BrowserModule } from '@angular/platform-browser';


@Component({
  selector: 'app-perfil-usuario',
  template: `
    <div class="bg-black pt-4 px-[34px] h-min-full">
      <div class="flex bg-opacity-60 p-4 rounded-[40px] items-end bg-[var(--spongedark)]">
        <div class="pl-[14px] flex-grow">
          <h1 class="font-montserrat font-bold text-4xl ml-[-2px] text-white">
            {{ nombreUsuario }}
          </h1>
          <div class="flex items-center mt-2">
            <p class="text-[var(--lightSponge)] text-base max-sm:hidden font-bold"> listas públicas -  </p>
            <p class="text-[var(--lightSponge)] text-base max-sm:hidden font-bold"> seguidores -  </p>
            <p class="text-[var(--lightSponge)] text-base max-sm:hidden font-bold"> seguidos</p>
          </div>

          <div class="mt-2">
            <button (click)="editarPerfil()" class="bg-[var(--sponge)] border-3 border-white rounded-full flex items-center px-4 py-1 mr-4 hover:bg-[var(--lightSponge)]">
                <img src="assets/editar.png" alt="Editar" class="w-4 h-4 mr-2">
                <p class="font-montserrat font-bold text-sm text-white">Editar</p>
            </button>
          </div>

        </div>

        <div class="flex-shrink-0">
          <img src="assets/logo2.png" alt="Logo" class="w-45 h-35 rounded-r-[40px]">
        </div>

      </div>

      <!-- Sección de listas publicas-->
      <div class="w-2/3 max-xl:w-full pr-20 max-xl:pr-0 mt-10">
          <h2 class="font-montserrat font-bold text-lg text-white mb-5">
              Listas públicas
          </h2>
      </div>

      <div class="flex gap-[40px] pt-2 overflow-hidden whitespace-nowrap flex-nowrap">
        @for(listaPublica of listasPublicas; track listaPublica) {
          <li>
            <div class="bg-[var(--sponge)] w-[150px] h-[150px] rounded-[40px] flex-none flex items-end justify-start overflow-hidden">
              <p class="text-black font-extrabold text-left text-[30px] mb-5 ml-[-4px] p-0 leading-none"
                style="word-break: break-word; white-space: normal;"> {{listaPublica.nombre}} </p>
            </div>
          </li>
        }
      </div>

      

      <!-- Sección de artistas a los que sigues-->
      <div class="w-2/3 max-xl:w-full pr-20 max-xl:pr-0 mt-5">
        <h2 class="font-montserrat font-bold text-lg text-white mb-5">
            Artistas a los que sigues
        </h2>
      </div>

      <div>
        <img class="object-cover h-[150px] w-[150px] rounded-[40px]" src="https://i.scdn.co/image/ab6761610000e5eb07620e28ffb1bdc8dd2d5ea0">
      </div>
      <div class="text-[15px] text-white pt-3 font-semibold self-start">Feid</div>


      <!-- Sección de podcasters a los que sigues-->
      <div class="w-2/3 max-xl:w-full pr-20 max-xl:pr-0 mt-5">
          <h2 class="font-montserrat font-bold text-lg text-white mb-5">
              Podcasters a los que sigues
          </h2>
      </div>






    </div>
  `,
  styles: []
})


export class PerfilUsuarioComponent implements OnInit {
  nombreUsuario: string = 'Cargando...'; //Valor por defecto
  usuario: any = null;

  listasPublicas =[
    { "nombre": "Running", "color": "#EF9210" },
    { "nombre": "Pop de los 90", "color": "#3858D9" },
    { "nombre": "Veranito", "color": "#38D950" },
    { "nombre": "En el coche", "color": "#E33273" },
    { "nombre": "Mi playlist nº982341", "color": "#3858D9" },
    { "nombre": "17:00pm", "color": "#38D950" },
    { "nombre": "San Valentin", "color": "#E33273" }
  ];


  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    const usuario = this.usuarioService.getUsuario();
    this.nombreUsuario = usuario ? usuario.nombre : 'Usuario desconocido';
  }

  editarPerfil() {}
}
