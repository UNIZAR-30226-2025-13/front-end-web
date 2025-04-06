import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';


@Component({
  selector: 'app-lista-podcasts',
  imports: [CommonModule],
  templateUrl: './lista-podcasts.component.html',
  
})
export class ListaPodcastsComponent {
  dominantColor: string = 'rgba(25, 152, 152, 4)'; //TODO
    album_name :string = 'La Pija y la Quinqui';//TODO
    album_icone:string ='assets/ejemplo_podcast.png';//TODO
    artista: string = 'Carlos Peguer y Mariang ' ;//TODO
    
    songs = [
  
      {
        
        title: 'CINE con TINI | La Pija y la Quniqui 4x20',
        description: 'Por fin conseguimos que llegue la Triple T a La Pija y la Quinqui, directa desde Argentina para hablar de la capacidad de cagar en cualquier sitio, de las energías y el horóscopo, y lo más ... ',
        tu_valoration: 0,
        valoration_media : 3,
        reproducion :'12335849',
        duration: '4:02'
  
  
      },
  
  
      { 
        title: 'PULCRAS Y PEDORRAS con LOLA LOLITA | La Pija y la Quinqui 4x19',
        description: 'Esta semana ha vuelto la luz para el ciego, el pan para el hambriento, la cura para el enfermo… esta semana ha vuelto Lola Lolita. Hablamos durante 20 minutos de reloj de limpiar la casa; ... ',
        
        tu_valoration: 3,
        valoration_media : 3,
        reproducion :'12335849',
        duration: '3:30',
      },
  
     
      {
        
        title: 'DENUNCIADOS con ANTONIO RESINES | La Pija y la Quinqui 4x18 ',
        description: 'Hoy se sienta en la mesa de La Pija y la Quinqui la persona con más solera no sólo que ha venido al podcast, sino de España: Antonio Resines. Hablamos de jubilarte y seguir trabaja...',
        
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
