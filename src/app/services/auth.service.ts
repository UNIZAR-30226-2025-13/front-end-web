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
    return this.http.get<any>(`${this.apiUrl}/artist?nombre_artista=${nombre_artista}`);
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

  
  getHome() {
    return this.http.get(`${this.apiUrl}/home`);
  }

  getHomeMusic() {
    return this.http.get(`${this.apiUrl}/home-music`);
  }

  getHomePodcast() {
    return this.http.get(`${this.apiUrl}/home-podcast`);
  }

  getUserLists(nombre_usuario: string) {
    return this.http.get(`${this.apiUrl}/get-lists?nombre_usuario=${nombre_usuario}`);
  }
  
  getUserPlaylists(nombre_usuario: string) {
    return this.http.get(`${this.apiUrl}/get-playlists?nombre_usuario=${nombre_usuario}`);
  }

  sendEmail(correo_electronico: string) {
    return this.http.put(`${this.apiUrl}/change-password-request?correo=${correo_electronico}`, {});
  }
  
  changePassword(user: any) {
    return this.http.post(`${this.apiUrl}/change-password`, user);
  }

  addSongToPlaylist(id_cancion: number, id_playlist: number) {
    return this.http.post(`${this.apiUrl}/add-song-playlist`, { id_cancion, id_playlist });
  }  

  createPlaylist(nombre_lista: string, nombre_usuario: string, color: string, tipo: string) {
    const playlistData = {
      nombre_lista,
      nombre_usuario,
      color,
      tipo
    };
    return this.http.post(`${this.apiUrl}/create-list`, playlistData);
  }
}
