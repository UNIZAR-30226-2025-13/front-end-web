import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QueueService {
  private apiUrl = 'http://localhost:8080'; // 🔹 Cambia esto por la URL real de tu API

  constructor(private http: HttpClient) {}

  /** 🔹 Obtiene la canción actual en la cola */
  getCurrentMedia(username: string, posicion: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/queue/get-cm?nombre_usuario=${username}&posicion=${posicion}`);
  }

  /** 🔹 Obtiene toda la cola de reproducción */
  getQueue(username: string, posicion: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/queue/show?nombre_usuario=${username}&posicion=${posicion}`);
  }

  /** 🔹 Agrega una canción a la cola */
  addToQueue(username: string, songId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/queue/add`, { id_cm: songId, nombre_usuario: username });
  }

  /** 🔹 Mezcla la cola de reproducción */
  shuffleQueue(username: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/queue/shuffle`, { nombre_usuario: username });
  }

  /** 🔹 Elimina toda la cola de reproducción */
  clearQueue(username: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/queue/clear`, { nombre_usuario: username });
  }

  playCm(id_cm: number) {
    return this.http.get<any>(`${this.apiUrl}/play-cm?id_cm=${id_cm}`)
  }
}
