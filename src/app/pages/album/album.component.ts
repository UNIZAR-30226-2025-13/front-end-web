import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';

@Component({
  selector: 'app-album',
  imports: [CommonModule],
  templateUrl: './album.component.html',
  styleUrl: './album.component.css'
})
export class AlbumComponent {

  
    dominantColor: string = 'rgba(25, 152, 152, 4)'; //TODO
    album_name :string = 'Fine Line';//TODO
    album_icone:string ='assets/exemple_song_2.png';//TODO
    nb_cancione:string = '3';//TODO
    tiempo:string = '5 min 5s';//TODO
    artista: string = 'Harry Styles' ;//TODO
    fecha:string = '13 de deciembre de 2006'; //TODO
    ano:string = '2006'//TODO
  
    songs = [
  
      {
        
        title: 'Watermelon Sugar',
        artist: 'Harry Styles ',
        tu_valoration: 0,
        valoration_media : 3,
        reproducion :'12335849',
        duration: '4:02'
  
  
      },
  
  
      { 
        title: 'Adore You',
        artist: 'Harry Styles ',
        
        tu_valoration: 3,
        valoration_media : 3,
        reproducion :'12335849',
        duration: '3:30',
      },
  
     
      {
        
        title: 'Falling ',
        artist: 'Harry Styles',
        
        tu_valoration: 3,
        valoration_media : 3,
        reproducion :'12335849',
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
