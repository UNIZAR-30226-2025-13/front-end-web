import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://spongefy-back-end.onrender.com';

  constructor(private http: HttpClient, private router: Router) {}

  login(loginData: any) {
    return this.http.post(`${this.apiUrl}/login`, loginData);
  }

  register(registerData: any) {
    return this.http.post(`${this.apiUrl}/register`, registerData);
  }

  deleteUser(deleteData: any) {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    return this.http.post(`${this.apiUrl}/deleteUser`, deleteData);
  }

  getArtist(nombre_artista: string) {
    return this.http.get<any>(`http://localhost:8080/artist?nombre_artista=${nombre_artista}`);
  }
  
  playSong(id_cancion: number) {
    return this.http.get(`/play-song?id_cancion=${id_cancion}`);
  }

  getPlaylists(nombre_usuario: string) {
    return this.http.get<any[]>(`${this.apiUrl}/get-playlists?nombre_usuario=${nombre_usuario}`);
  }

  getPlaylistData(id_playlist: string){
    return this.http.get<any>(`${this.apiUrl}/get-playlist-data?id_playlist=${id_playlist}`);
  }

  

}
