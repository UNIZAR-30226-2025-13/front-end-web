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

  getPodcaster(nombre_podcaster: string) {
    return this.http.get<any>(`${this.apiUrl}/podcaster?nombre_podcaster=${nombre_podcaster}`);
  }
  
  playSong(id_cancion: number) {
    return this.http.get(`${this.apiUrl}/play-song?id_cancion=${id_cancion}`);
  }

  getPlaylists(nombre_usuario: string) {
    return this.http.get<any[]>(`${this.apiUrl}/get-playlists?nombre_usuario=${nombre_usuario}`);
  }

  getList(id_lista: string){
    return this.http.get<any>(`${this.apiUrl}/get-list-data?id_lista=${id_lista}`);
  }

  getFolder(id_carpeta: string){
    return this.http.get<any>(`${this.apiUrl}/get-folder?id_carpeta=${id_carpeta}`);
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
    return this.http.get(`${this.apiUrl}/get-user-library?nombre_usuario=${nombre_usuario}`);
  }
  
  getUserPlaylists(nombre_usuario: string) {
    return this.http.get(`${this.apiUrl}/get-playlists?nombre_usuario=${nombre_usuario}`);
  }

  listUserFolder(nombre_usuario: string) {
    return this.http.get(`${this.apiUrl}/list-user-folder?nombre_usuario=${nombre_usuario}`);
  }

  sendEmail(correo_electronico: string) {
    return this.http.put(`${this.apiUrl}/change-password-request?correo=${correo_electronico}`, {});
  }
  
  changePassword(user: any) {
    return this.http.post(`${this.apiUrl}/change-password`, user);
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
  
  addSongToPlaylist(id_cancion: number, id_playlist: number) {
    return this.http.post(`${this.apiUrl}/add-song-playlist`, { id_cancion, id_playlist });
  } 
  
  createFolder(nombre_carpeta: any, nombre_usuario: string) {
    const folderData = {
      nombre_carpeta,
      nombre_usuario
    };
    return this.http.post(`${this.apiUrl}/create-folder`, folderData);
  }

  addPlaylistToFolder(nombre_usuario: string, id_carpeta: number, id_lista: string) {
    const list_folderData = {
      nombre_usuario,
      id_carpeta,
      id_lista
    };
    return this.http.post(`${this.apiUrl}/add-list-to-folder`, list_folderData);
  } 

  deleteFolder(nombre_usuario: string, id_carpeta: number) {
    const folderData = {
      nombre_usuario,
      id_carpeta
    };
    return this.http.post(`${this.apiUrl}/remove-folder`, folderData);
  }

  deleteListFromFolder(nombre_usuario: string, id_carpeta: number, id_lista: number) {
    const list_folderData = {
      nombre_usuario,
      id_carpeta,
      id_lista
    };
    return this.http.post(`${this.apiUrl}/remove-list-from-folder`, list_folderData);
  }

  searchCreator(name: string) {
    return this.http.get<any>(`${this.apiUrl}/search-creator?cadena=${name}`);
  }

  searchMultimedia(name: string) {
    return this.http.get<any>(`${this.apiUrl}/search-multimedia?cadena=${name}`);
  }

  searchAlbum(name: string) {
    return this.http.get<any>(`${this.apiUrl}/search-album?cadena=${name}`);
  }

  searchPodcast(name: string) {
    return this.http.get<any>(`${this.apiUrl}/search-podcast?cadena=${name}`);
  }

  searchUsuarios(name: string) {
    return this.http.get<any>(`${this.apiUrl}/search-usuario?cadena=${name}`);
  }
  
}
