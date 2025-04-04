import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Creneaux } from '../models/creneaux.model';

@Injectable({
  providedIn: 'root'
})
export class CreneauxService {
  private apiUrl = 'http://localhost:8080/gestionImpression/creneaux';

  constructor(private http: HttpClient) { }

  getAllCreneaux(): Observable<Creneaux[]> {
    return this.http.get<Creneaux[]>(this.apiUrl);
  }
  getCreneau(id: number): Observable<Creneaux> {
    return this.http.get<Creneaux>(`${this.apiUrl}/${id}`);
  }

  createCreneau(creneau: Creneaux): Observable<Creneaux> {
    return this.http.post<Creneaux>(this.apiUrl, creneau).pipe(
      catchError((error) => {
        if (error.status === 400 || error.error.message.includes("already reserved")) {
          alert("This time slot is already reserved. Please choose another one.");
        }
        return throwError(error);
      })
    );
  
  }

  updateCreneau(id: number, creneau: Creneaux): Observable<Creneaux> {
    return this.http.put<Creneaux>(`${this.apiUrl}/${id}`, creneau);
  }
  deleteCreneau(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}