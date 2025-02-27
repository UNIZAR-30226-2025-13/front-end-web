import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-artiste',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './artiste.component.html',
  styleUrl: './artiste.component.css'
})
export class ArtisteComponent {
    type: string = "Artista"; // make a request
    name_artiste: string = "Harry Styles"; // make a request
    nb_follower: string = "33.587.356"; // make a request
    img_artiste: string = "assets/image_test_artiste.png" //make a request

    follow(){}//to do

    songs = [
      {
        icon: 'assets/exemple_song_1.png',
        title: 'As It Was',
        artist: 'Harry Styles ',
        number: 1000000,
        duration: '3:45'
      },
      {
        icon: 'assets/exemple_song_2.png',
        title: 'Watermelon Sugar',
        artist: 'Harry Styles ',
        number: 950000,
        duration: '4:02'
      },
      {
        icon: 'assets/exemple_song_2.png',
        title: 'Adore You',
        artist: 'Harry Styles ',
        number: 870000,
        duration: '3:30'
      },
      {
        icon: 'assets/exemple_song_3.png',
        title: 'Sign of the Times',
        artist: 'Harry Styles ',
        number: 800000,
        duration: '4:15'
      },
      {
        icon: 'assets/exemple_song_2.png',
        title: 'Falling ',
        artist: 'Harry Styles',
        number: 750000,
        duration: '3:50'
      }
    ]; // make a request
  
    playSong(song: any){}//to do
    this_is(){}//to do
    


    selectedTab: 'album' | 'cancion' = 'album'; // Par défaut sur Album

    albums = [
      { cover: 'assets/exemple_song_1.png', title: 'Album 1' },
      { cover: 'assets/exemple_song_2.png', title: 'Album 2' },
      { cover: 'assets/exemple_song_3.png', title: 'Album 3' }
    ];
  
    Canciones = [
      {
        icon: 'assets/exemple_song_1.png',
        title: 'As It Was',
        artist: 'Harry Styles ',
        number: 1000000,
        duration: '3:45'
      },
      {
        icon: 'assets/exemple_song_2.png',
        title: 'Watermelon Sugar',
        artist: 'Harry Styles ',
        number: 950000,
        duration: '4:02'
      },
      {
        icon: 'assets/exemple_song_2.png',
        title: 'Adore You',
        artist: 'Harry Styles ',
        number: 870000,
        duration: '3:30'
      },
      {
        icon: 'assets/exemple_song_3.png',
        title: 'Sign of the Times',
        artist: 'Harry Styles ',
        number: 800000,
        duration: '4:15'
      },
      {
        icon: 'assets/exemple_song_2.png',
        title: 'Falling ',
        artist: 'Harry Styles',
        number: 750000,
        duration: '3:50'
      }
    ];
  
    setTab(tab: 'album' | 'cancion') {
      this.selectedTab = tab;
    }
  }

