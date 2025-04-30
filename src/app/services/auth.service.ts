import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

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
    return this.http.post(`${this.apiUrl}/delete-account`, deleteData);
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

  getList(id_lista: string, nombre_usuario: string) {
    return this.http.get<any>(`${this.apiUrl}/get-list-data?id_lista=${id_lista}&nombre_usuario=${nombre_usuario}`);
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

  createPlaylistIA(nombre_playlist: string, nombre_usuario: string, color: string, contexto: string) {
    const playlistData = {
      nombre_playlist,
      contexto,
      color,
      nombre_usuario
    };
    return this.http.post(`${this.apiUrl}/generar-playlist`, playlistData);
  }

  getInfoAlbum(id: number)
  {return this.http.get(`${this.apiUrl}/album?id_album=${id}`)}

  shuffle(nombre_usuario: string, posicion: number) {
    const body = {
      nombre_usuario: nombre_usuario,
      posicion: posicion
    };
  
    return this.http.post(`${this.apiUrl}/queue/shuffle`, body);
  }

  
  
  addSongToPlaylist(id_cancion: number, id_playlist: number) {
    const folderData = {
      id_cancion,
      id_playlist
    };
    return this.http.post(`${this.apiUrl}/add-song-playlist`, folderData);
  } 

  addEpisodioToLista(id_ep:number, id_lista_ep:number){
    const folderData = {
      id_episodio: id_ep,
      id_lista_ep
    }; 
    return this.http.post(`${this.apiUrl}/add-ep-lista-episodios`, folderData);

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

  removeCMFromLista(id_cm:string, id_lista:string){
    const remove= {
    id_cm, 
    id_lista}
    return this.http.post<any>(`${this.apiUrl}/remove-cm-from`, remove);
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

  searchListas(name: string) {
    return this.http.get<any>(`${this.apiUrl}/search-lista?cadena=${name}`);
  }

  searchGeneral(name: string) {
    return this.http.get<any>(`${this.apiUrl}/search-?cadena=${name}`);
  }


  updateProfile(nombre_usuario: string, nuevo_email: string, nueva_contrasena: string) {
    const body = {
      nombre_usuario,
      nuevo_email,
      nueva_contrasena
    };
    return this.http.post(`${this.apiUrl}/update-profile`, body);
  }
  
  


  uploadCreador(formData: FormData) {
    return this.http.post(`${this.apiUrl}/admin/upload-creator`, formData);
  }

  updateCreador(formData: FormData) {
    return this.http.post(`${this.apiUrl}/admin/update-creator`, formData);
  }
  
  eliminarCreador(nombreCreador: string) {
    const body = { nombre_creador: nombreCreador };
    return this.http.post(`${this.apiUrl}/admin/delete-creator`, body);
  }

  uploadAlbum(formData: FormData) {
    return this.http.post(`${this.apiUrl}/admin/upload-album`, formData);
  }
  

  getNumeroSeguidoresYSeguidos(nombre: string) {
    return this.http.get<any>(`${this.apiUrl}/get-number-followers-and-following?nombre_usuario=${nombre}`);
  }
  

  getPublicLists(nombre: string) {
    return this.http.get<any>(`${this.apiUrl}/get-public-lists?nombre_usuario=${nombre}`);
  }

  getFriendsList(nombre: string) {
    return this.http.get<any>(`${this.apiUrl}/get-friends-list?nombre_usuario=${nombre}`);
  }

  
  changeListPrivacy (id_lista: number, nombre_usuario: string) {
    const listData = {
      id_lista,
      nombre_usuario
    }
    return this.http.post(`${this.apiUrl}/change-list-privacy`, listData)
  }

  followUser(nombre_usuario: string, nombre_usuario_a_seguir: string) {
    const follow = {
      nombre_usuario,
      nombre_usuario_a_seguir
    }
    return this.http.post<any>(`${this.apiUrl}/follow-user`, follow);
  }

  unfollowUser(nombre_usuario: string, nombre_usuario_a_dejar_seguir: string) {
    const unfollow = {
      nombre_usuario,
      nombre_usuario_a_dejar_seguir
    }
    return this.http.post<any>(`${this.apiUrl}/unfollow-user`, unfollow);
  }
  
  isFollowerUser(nombre_usuario: string, nombre_usuario_a_seguir: string) {
    return this.http.get<any>(`${this.apiUrl}/is-a-follower-of-user`, {
      params: {
        nombre_usuario,
        nombre_usuario_a_seguir
      }
    });
  }

  followCreator(nombre_usuario: string, nombre_creador: string) {
    const follow = {
      nombre_usuario,
      nombre_creador
    }
    return this.http.post<any>(`${this.apiUrl}/follow-creator?`, follow);
  }

  unfollowCreator(nombre_usuario: string, nombre_creador: string) {
    const unfollow = {
      nombre_usuario,
      nombre_creador
    }
    return this.http.post<any>(`${this.apiUrl}/unfollow-creator`, unfollow);
  }

  isFollowerCreator(nombre_usuario: string, nombre_creador: string) {
    return this.http.get<any>(`${this.apiUrl}/is-a-follower-of-creator`, {
      params: {
        nombre_usuario,
        nombre_creador
      }
    });
  }

  addToFav(id_cm: number, nombre_usuario: string) {
    const fav = {
      nombre_usuario,
      id_cm
    }
    return this.http.post<any>(`${this.apiUrl}/add-to-favourites`, fav);
  }

  showSong(id_cancion: number) {
    return this.http.get<any>(`${this.apiUrl}/song/show?id_cancion=${id_cancion}`);
  }

  showLyrics(id_cancion: number){
    return this.http.get<any>(`${this.apiUrl}/song/show-lyrics?id_cancion=${id_cancion}`);
  }

  getRate(id_cm: number, nombre_usuario: string) {
    return this.http.get<any>(`${this.apiUrl}/get-rate?id_cm=${id_cm}&nombre_usuario=${nombre_usuario}`);
  }
  postRate(id_cm:number, nombre_usuario:string, valoracion:number){
    const body = {
      id_cm,
      nombre_usuario,
      valoracion
    }
    return this.http.post<any>(`${this.apiUrl}/post-rate`, body);

  }

  deleteRate(id_cm:number, nombre_usuario:string){
    const body = {
      id_cm,
      nombre_usuario
    }
    return this.http.post<any>(`${this.apiUrl}/delete-rate`, body);
  }
  

  getAverageRate(id_cm: number) {
    return this.http.get<any>(`${this.apiUrl}/get-average-rate?id_cm=${id_cm}`);
  }

  getPodcast(id_podcast: number, nombre_usuario: string) {
    return this.http.get<any>(`${this.apiUrl}/get-podcast?id_podcast=${id_podcast}&nombre_usuario=${nombre_usuario}`);
  }

  saveLastPlaying(nombre_usuario: string, id_cm: number, tiempo: any) {
    const lastPlaying = {
      nombre_usuario,
      id_cm,
      tiempo
    }
    return this.http.post<any>(`${this.apiUrl}/save-last-playing`, lastPlaying);
  }

  recoverLastPlaying(nombre_usuario: string) {
    return this.http.get<any>(`${this.apiUrl}/recover-last-playing?nombre_usuario=${nombre_usuario}`);
  }
  
  getEpisode(id_ep:number){
     return this.http.get<any>(`${this.apiUrl}/get-episode?id_ep=${id_ep}`);

  }

  getEpisodeList( nombre_usuario: string){
    return this.http.get<any>(`${this.apiUrl}/get-episode-lists?nombre_usuario=${nombre_usuario}`);
  }

}
