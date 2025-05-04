import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../../services/reservation.service';
import { CreneauxService } from '../../../services/creneaux.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservation-list',
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './reservation-list.component.html',
  styleUrl: './reservation-list.component.css'
})
export class ReservationListComponent implements OnInit {
  reservations: any[] = [];
  loading: boolean = true;
  enseignantId: number = 2; // À adapter dynamiquement selon le login
  
  constructor(private reservationService: CreneauxService ) {}
  
  ngOnInit(): void {
    this.getReservations();
  }
  
  getReservations(): void {
    this.reservationService.getAllCreneaux()
      .subscribe({
        next: (data) => {
          this.reservations = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des réservations :', err);
          this.loading = false;
        }
      });
  }
}