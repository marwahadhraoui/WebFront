import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../../services/reservation.service';
import { CreneauxService } from '../../../services/creneaux.service';
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../../services/auth.service';

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
  enseignantId: number = 3; // À adapter dynamiquement selon le login
  
  constructor(private reservationService: CreneauxService ,private authService: AuthService) {}
  
  ngOnInit(): void {
    this.getReservations();
  }
  
  getReservations(): void { 
    const currentUser = this.authService.getUser();

    if (!currentUser) {
      console.error('Aucun utilisateur connecté');
      return;
    } 
    
   
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