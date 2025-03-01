import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-player',
  imports: [CommonModule], // 👈 Importando CommonModule correctamente
  template: `
  <div class="bg-black">
  <div class="flex flex-row bg-[var(--sponge)] w-full h-[90px] rounded-tl-[40px] rounded-tr-[40px] justify-between">
    
    <!-- Parte izquierda -->
    <div class="flex items-center pl-10 flex-1 gap-2">
      <img src="assets/portada.png" class="h-[60px] pt-2 mr-2">
      <div class="text-white text-sm">
        <a class="block font-bold">capaz (merengueton)</a>
        <div class="flex flex-row flex-wrap">
          <ng-container *ngFor="let cantante of cantantes; let i = index">
            <a>{{ cantante }}</a>
            <span *ngIf="i < cantantes.length - 1">,&nbsp;</span>
          </ng-container>
        </div>
      </div>
      <img src="assets/anyadirplaylist.png" class="h-[25px]">
      <img src="assets/fav.png" class="h-[25px]">
    </div>
  
    <!-- Parte central -->
    <div class="flex flex-col justify-center flex-1 items-center max-lg:mr-10">
      <div class="flex flex-row gap-2 max-sm:justify-end max-sm:items-end max-sm:w-full">
        <img class="w-[30px] h-[30px] max-sm:hidden" src="assets/aleatorio.png">
        <img class="w-[35px] h-[35px] max-sm:hidden" src="assets/atras.png">

        <!-- Botón de play/pause con control de audio -->
        <div 
          class="w-[35px] h-[35px] flex items-center justify-center transition-transform duration-200"
          [style.transform]="isPlaying ? 'rotate(45deg)' : 'rotate(0deg)'"
          (click)="togglePlay()">
          <img 
            class="w-full h-full transition-transform duration-200"
            [src]="isPlaying ? 'assets/pause.png' : 'assets/play.png'">
        </div>

        <img class="w-[35px] h-[35px] max-sm:hidden" src="assets/adelante.png">
        <img class="w-[30px] h-[30px] max-sm:hidden" src="assets/bucle.png">
      </div>

      <!-- Barra de progreso de la canción -->
      <div class="flex flex-row text-white gap-2 items-center max-sm:hidden">
        <a>{{ currentTime | date:'m:ss' }}</a> 
        <input 
          type="range" 
          [value]="currentTime" 
          [max]="duration" 
          (input)="seekAudio($event)" 
          class="w-[400px] max-md:w-[200px]">
        <a>{{ duration | date:'m:ss' }}</a>
      </div>
    </div>

    <!-- Parte derecha -->
    <div class="flex flex-row items-center pr-10 flex-1 justify-end max-lg:hidden">
      <img class="w-[30px] h-[30px] mr-2" src="assets/lyrics.png">
      <img class="w-[30px] h-[30px] mr-2" src="assets/queue.png">
      <img class="w-[30px] h-[30px] mr-2" src="assets/sound.png">
      <hr class="border-2 border-white w-[100px]">
    </div>
  </div>

  <!-- Elemento de audio (oculto) con enlace de Cloudinary -->
  <audio #audioPlayer (timeupdate)="updateTime()" (loadedmetadata)="setDuration()">
    <source src="https://res.cloudinary.com/djsm3jfht/video/upload/v1740771781/minaelhammani_i6b7wb.mp3" type="audio/mpeg">
    Tu navegador no soporta el elemento de audio.
  </audio>
</div>

  `,
  styles: []
})
export class PlayerComponent {
  @ViewChild('audioPlayer', { static: false }) audioPlayer!: ElementRef<HTMLAudioElement>;

  cantantes = ['Alleh', 'Yorghaki'];
  isPlaying = false;
  currentTime = 0;
  duration = 0;

  togglePlay() {
    if (this.isPlaying) {
      this.audioPlayer.nativeElement.pause();
    } else {
      this.audioPlayer.nativeElement.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  updateTime() {
    this.currentTime = this.audioPlayer.nativeElement.currentTime;
  }

  setDuration() {
    this.duration = this.audioPlayer.nativeElement.duration;
  }

  seekAudio(event: Event) {
    const input = event.target as HTMLInputElement;
    this.audioPlayer.nativeElement.currentTime = +input.value;
  }
}
