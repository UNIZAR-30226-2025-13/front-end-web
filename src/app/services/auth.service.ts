import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080';

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

  playSong(song: any) {
    return this.http.get<any>(`${this.apiUrl}/play-song?id_cancion=${song}`)
  }

  getHome() {
    return this.http.get(`${this.apiUrl}/home`);
  }

}
