import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { Creneaux } from '../../models/creneaux.model';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';
import { CreneauxService } from '../../services/creneaux.service';
import { FilterPipe } from '../filter.pipe';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog'; 
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule,  MatSnackBarModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  creneaux: Creneaux[] = [];
  totalOccupes = 0;
  totalDisponibles = 0;
  totalEnAttente = 0;

  filterMatiere: string = '';
  filterStatut: string = '';

  constructor(
    private creneauxService: CreneauxService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchReservations();
  }

  fetchReservations(): void {
    this.creneauxService.getAllCreneaux().subscribe(
      (data: Creneaux[]) => {
        this.creneaux = data;
        this.updateStats();
      },
      (error) => {
        console.error('Erreur lors de la récupération des Creneaux :', error);
        this.showToast('Erreur lors du chargement des réservations', 'error');
      }
    );
  }

  get filteredReservations(): Creneaux[] {
    return this.creneaux.filter(creneaux => {
     
      const matiereMatch = this.filterMatiere === '' || creneaux.reservation?.matiere?.toLowerCase().includes(this.filterMatiere.toLowerCase());
      const statutMatch = this.filterStatut === '' || creneaux.statut === this.filterStatut;
      return matiereMatch && statutMatch;
    });
  }

  confirmValidation(creneaux: Creneaux): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmer la validation',
        message: `Voulez-vous vraiment valider la réservation pour ${creneaux.reservation?.matiere} ?`,
        confirmText: 'Valider',
        cancelText: 'Annuler',
        confirmColor: 'primary'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.validerReservation(creneaux);
      }
    });
  }

  confirmAnnulation(creneaux:Creneaux): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmer l\'annulation',
        message: `Voulez-vous vraiment annuler la réservation pour ${creneaux.reservation?.matiere} ?`,
        confirmText: 'Confirmer',
        cancelText: 'Retour',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.annulerReservation(creneaux);
      }
    });
  }

  validerReservation(creneaux: Creneaux): void {
    if (creneaux.reservation) {
      creneaux.statut = 'Validée';
      this.creneauxService.updateCreneau(creneaux.id!, creneaux).subscribe({
        next: () => {
          this.updateStats();
          this.showToast('Réservation validée avec succès', 'success');
        },
        error: (error) => {
          console.error("Erreur lors de la validation :", error);
          this.showToast('Erreur lors de la validation', 'error');
        }
      });
    }
  }

  annulerReservation(creneaux: Creneaux): void {
    if (creneaux.reservation) {
      creneaux.statut = 'Annulée';
      this.creneauxService.updateCreneau(creneaux.id!, creneaux).subscribe({
        next: () => {
          this.updateStats();
          this.showToast('Réservation annulée avec succès', 'success');
        },
        error: (error) => {
          console.error("Erreur lors de l'annulation :", error);
          this.showToast('Erreur lors de l\'annulation', 'error');
        }
      });
    }
  }

  updateStats(): void {
    this.totalOccupes = this.creneaux.filter(r => r.statut === 'Validée').length;
    this.totalDisponibles = this.creneaux.filter(r => r.statut === 'Annulée').length;
    this.totalEnAttente = this.creneaux.filter(r => r.statut === 'TERMINE').length;
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: type === 'success' ? ['toast-success'] : ['toast-error'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}