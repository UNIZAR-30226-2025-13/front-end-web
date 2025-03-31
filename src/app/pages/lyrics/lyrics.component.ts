import { Component } from '@angular/core';
import { CommonModule} from '@angular/common';

@Component({
  selector: 'app-lyrics',
  imports: [CommonModule],
  
  template:`
  <pre class="text-white font-bold text-3xl overflow-y-auto rounded-lg m-5 p-7" [ngStyle]="{'background-color': dominantColor}" [innerText]="text"></pre>
  `,
})
export class LyricsComponent {
  dominantColor: string = 'rgba(69, 203, 96, 0.5)';
  text:string = `Bellaquita
Bellaquita
Eh
Ey, yo, es Ousi
Yeah-yeah
Dei V, Underwater
Bellaquita

Me diste follow y te di followback
Me diste like y yo te di dos pa'trá'
Toma, al otro día me pusiste en los close friends
Eso es lo que tú quieres, ma
Voy pa'l DM, de espalda, de la'o o de frente
En toa' las fotito' se ve bien
Mami, te lo doy ahora y después también
Subió una story cerca, estoy que le llego a pie, еh
Ouh, ma, yo quiero que tú sea' mi loba
Tú mе tiene' a mí en la cuerda floja`;
  
  

}
