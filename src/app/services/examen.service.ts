import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation.model';
import { Examen } from '../models/examen.model';

@Injectable({
  providedIn: 'root'
})
export class ExamenService {
  private apiUrl = 'http://localhost:8080/gestionImpression/examens';

  private apiUrl1 = 'http://localhost:8080/gestionImpression/reservations';
 
  constructor(private http: HttpClient) { }

  getAllExamens(): Observable<Examen[]> {
      return this.http.get<Examen[]>(this.apiUrl);
    }
    associateExamen(reservationId: number, examenId: number): Observable<Reservation> {
        return this.http.post<Reservation>(
          `${this.apiUrl1}/${reservationId}/associate-examen?examenId=${examenId}`, 
          {}
        );
      } 

      getAlertesExamens(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/alertes`);
      }
    
      getExamens(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}`);
      }
}