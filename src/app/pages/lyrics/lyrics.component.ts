import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef,HostListener, ElementRef, } from '@angular/core';
import { CommonModule} from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterModule, Router } from '@angular/router'

import { PlayerService } from '../../services/player.service';

// @ts-ignore

import { UsuarioService } from '../../services/usuario.service';
import { QueueService } from '../../services/queue.service';

@Component({
  selector: 'app-lyrics',
  imports: [CommonModule,RouterModule],
  
  template:`
  <pre class="text-white font-bold text-3xl overflow-y-auto rounded-lg m-5 p-7 bg-[var(--graybackground)]"  [innerText]="text"></pre>
  `,
})

export class LyricsComponent {
  constructor(
        private authService: AuthService,
        private titleService: Title,
        private route: ActivatedRoute,
        private router: Router,
        private playerService: PlayerService,
        private userService: UsuarioService,
        private queueService: QueueService
      ) {}
  
 
  id_ep:string='' ;
  text:string = '';
  
ngOnInit() {
  this.id_ep = this.route.snapshot.paramMap.get('id_ep') ?? '';
  this.authService.showLyrics(parseInt(this.id_ep)).subscribe((data) => {
    console.log("data", data)
    console.log("lyrics", data.letra)
    this.text = data.letra;
   
  })
}

}
