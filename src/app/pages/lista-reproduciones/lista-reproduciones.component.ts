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
  templateUrl: './lista-reproduciones.component.html',
  styleUrl: './lista-reproduciones.component.css'
})
export class ListaReproducionesComponent {
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
