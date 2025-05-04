import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:8080/gestionImpression/reservations';
 
  constructor(private http: HttpClient) { }

  getAllReservations(): Observable<Reservation[]> {
      return this.http.get<Reservation[]>(this.apiUrl);
    }
  createReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, reservation);
  }

  updateReservation(id: number, reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${id}`, reservation);
  } 
  getReservationsByEnseignant(enseignantId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/enseignant/${enseignantId}`);
  }
}