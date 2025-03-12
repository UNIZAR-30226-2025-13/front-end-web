import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterModule, Router } from '@angular/router'
import localeEs from '@angular/common/locales/es';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-lista-reproduciones',
  imports: [CommonModule],
  template: `
  
<div class="bg-black pt-4 px-[34px] min-h-screen">

<!-- upper box -->
<div class="flex bg-opacity-60 p-4 rounded-[40px] items-end" [ngStyle]="{'background-color': dominantColor}">
    
        <div class="flex-row  items-center justify-center">
            <div class="flex flex-row items-center justify-center space-x-4"> <!-- flex-row pour aligner horizontalement -->
                
                <div class="bg-blue-200 rounded-[20px] h-[200px] w-[200px] flex items-center justify-center p-4">
                    <h1 class="font-montserrat font-bold text-4xl text-black text-center">{{ lista_name }}</h1>
                </div>
                
                <!-- lista information-->
                <div class="flex flex-col items-start pt-20">
                    <p class="text-white">Lista de reproducción</p>
                    <h1 class="font-montserrat font-bold text-4xl ml-[-2px] text-white">{{ lista_name }}</h1>
                    <p class="text-white">{{visibility}} | {{nb_cancione}} canciones | {{tiempo}}</p>
                </div>
            </div>
        <div class=" flex mt-4">
            <img src="assets\play.png" alt="play" (click)="playSong(songs[0])" class=" h-[52px] w-[52px]">
            <img src="assets\aleatorio.png" alt="aleatorio" (click)="random()" class=" h-[52px] w-[52px]">
            <img src="assets\anyadirplaylist.png" alt="anadir" (click)="add()" class=" h-[52px] w-[52px]">
            <p (click)="option()" class="font-montserrat font-bold text-4xl text-white h-[58px] w-[31px]">...</p> 
        </div>
</div>
</div >
<!-- upper box -->
<div class="flex justify-between ">
    <div class="flex items-center gap-2 m-4 p-2 rounded-full  hover:bg-neutral-700 hover:border-neutral-600 focus-within:border-neutral-500 focus-within:bg-neutral-600 transition-colors w-fit">
        <img src="assets/search.png" class="h-[40px] w-[40px]">
        <input class="font-montserrat text-white text-lg bg-transparent outline-none placeholder-gray-400 rounded-md px-2 min-w-[100px] w-full flex-1" placeholder="Buscar">
    </div>

    <div class="flex font-montserrat text-white text-lg  m-4 items-center" onclick="sort()">
        <img src="assets/sort.png" class="h-[22px] w-[22px]">
        <p class="m-2">Fecha en la que se se añadió</p>
    </div>
</div>
<div class="m-4">       
<!-- song list -->
<div class="grid grid-cols-20 gap-4 text-left text-white">

    <div class="font-bold col-span-6 ">Título</div>
    <div class="font-bold col-span-4 ">Álbum</div>
    <div class="font-bold col-span-4">Tu valoración</div>
    <div class="font-bold col-span-4">Fecha en la que se añadió</div>
    <div class="font-bold col-span-1">Duracion</div>
</div>
<hr class="border-t-2 border-white my-4 ">  
    <div *ngFor="let song of songs" class="grid grid-cols-20 gap-4  text-white items-center ">
        <div class="flex m-4 col-span-6 ">
            <img [src]=song.icon alt="Icono de la canción" (click)="playSong(song)"
                class="w-[45px] h-[45px] rounded-[10px] object-cover flex-shrink-0 mr-4">
            <div class="flex flex-col min-w-0">
                <p class="font-montserrat font-bold text-lg text-white">
                    {{ song.title  }}
                </p>
                <div class="flex flex-row">
                  <p  class="text-white text-sm hover:underline">
                      {{ song.artist }}
                 </div>
            </div>
        </div>
        <div class="col-span-4">{{ song.album }}</div>
        <div class="col-span-4 flex"  >
            <img *ngFor="let star of generateStars(song.valoration)" [src]="'assets/star.png'" alt="Étoile" class="w-5 h-auto flex-col"/>
            <script src="script.js"></script>
          
        </div> 
        <div class="col-span-4">{{ song.fecha }}</div> 
        <div class="col-span-1">{{ song.duration }}</div>
        <div class=" flex items-center space-x-3   col-span-1">
            <img src="assets\anyadirplaylist.png" alt="anadir" (click)="add()" class=" h-[17px] w-[18px]">
            <img src="assets\heart.png" alt="like" (click)="like()" class=" h-[17px] w-[18px]">
            <p (click)="option()" class="font-montserrat font-bold text-xl text-white pb-3 ">...</p> 
    
        </div>
    
    </div>
    <hr class="border-t-2 border-white my-4">  
</div>  
</div>

  `,
})
export class ListaReproduccionesComponent {
  dominantColor: string = 'rgba(25, 152, 152, 4)'; //TODO
  lista_name :string = 'a la ducha';//TODO
  visibility:string = 'publica';//TODO
  nb_cancione:string = '5';//TODO
  tiempo:string = '13 min 5s';//TODO

  songs = [

    {
      icon: 'assets/exemple_song_1.png',
      title: 'As It Was',
      artist: 'Harry Styles ',
      album: 'album_3',
      valoration: 5,
      fecha:'13 de deciembre de 2006',
      duration: '3:45'
    },

    {
      icon: 'assets/exemple_song_2.png',
      title: 'Watermelon Sugar',
      artist: 'Harry Styles ',
      album: 'album_3',
      valoration: 2,
      fecha:'13 de deciembre de 2006',
      duration: '4:02'


    },


    {  icon: 'assets/exemple_song_2.png',
      title: 'Adore You',
      artist: 'Harry Styles ',
      album: 'album_2',
      valoration: 3,
      fecha:'13 de deciembre de 2006',
      duration: '3:30',
    },

    {
      icon: 'assets/exemple_song_3.png',
      title: 'Sign of the Times',
      artist: 'Harry Styles ',
      album: 'album_3',
      valoration: 3,
      fecha:'13 de deciembre de 2006',
      duration: '4:15'
    },
    {
      icon: 'assets/exemple_song_2.png',
      title: 'Falling ',
      artist: 'Harry Styles',
      album: 'album_3',
      valoration: 3,
      fecha:'13 de deciembre de 2006',
      duration: '3:50'
    }
  ];
  //to play the first song of the playlist
  playSong(song: any){} //TODO
  //to put in aleatorio mode
  random(){} //TODO
  //to anadir
  add(){}//TODO
  option(){}//TODO
  like(){}//TODO


  generateStars(valoration: number): number[] {
    return new Array(valoration).fill(0); 
  }

  sort(){}//TODO
}
