import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterModule, Router } from '@angular/router'
import localeEs from '@angular/common/locales/es';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-cancion',
  imports: [CommonModule],
  templateUrl: './cancion.component.html',
  styleUrl: './cancion.component.css'
})
export class CancionComponent {
  dominantColor: string = 'rgba(0, 70, 50 , 4)'; //TODO
 

  song = 

    {
      icon: 'assets/exemple_song_1.png',
      title: 'As It Was',
      artist: 'Harry Styles ',
      album: 'album_3',
      tu_valoration: 5,
      valoracion_media:3,
      fecha:'13 de deciembre de 2006',
      reproducione :"1237567492",
      duration: '3:45',
      ano:'2006'
    }

    
  ;
  //to play the first song of the playlist
  playSong(){} //TODO
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

