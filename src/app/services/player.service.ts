import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private currentSongSubject = new BehaviorSubject<any>(null);
  currentSong = this.currentSongSubject.asObservable();

  constructor() {}

  playSong(song: any) {
    console.log(song)
    this.currentSongSubject.next(song);
  }
}
