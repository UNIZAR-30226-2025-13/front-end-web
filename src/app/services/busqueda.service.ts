import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class BusquedaService {
  private cadenaBusqueda = new BehaviorSubject<string>(''); // Inicializamos con una cadena vacía
  cadenaBusqueda$ = this.cadenaBusqueda.asObservable(); // Observable para suscribirse

  actualizarBusqueda(nuevaCadena: string) {
    this.cadenaBusqueda.next(nuevaCadena); // Emitimos el nuevo valor
  }
}
