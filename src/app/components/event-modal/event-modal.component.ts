import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreneauxService } from '../../services/creneaux.service';
import { ReservationService } from '../../services/reservation.service';
import { Creneaux } from '../../models/creneaux.model';

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  imports: [CommonModule, FormsModule],
  styleUrl: './event-modal.component.css'
})
export class EventModalComponent {
  @Input() isVisible = false;
  @Input() date: string = '';
  @Input() heureDebut: string = '';
  @Input() heureFin: string = '';
  @Input() creneau: Creneaux | null = null;
  @Input() isEditMode: boolean = false;
  @Output() eventSaved = new EventEmitter<any>();
  @Output() closeModal = new EventEmitter<void>();

  typeImpression: string = '';
  specialite: string = 'Informatique'; // Valeur par défaut
  niveau: string = '1ere Annee'; // Valeur par défaut
  matiere: string = '';
  type: string = 'Énoncé simple';
  nbrImpression: number = 1;
  selectedStatus: string = 'not_yet';

  // Liste des spécialités disponibles
  specialites: string[] = [
    'Informatique',
    'Infotronique',
    'Mecanique',
    'Industrielle',
    'Autre'
  ];

  // Liste des niveaux disponibles
  niveaux: string[] = [
    '1ere Annee',
    '2eme Annee',
    '3eme Annee'
  ];

  types: string[] = [
    'Énoncé simple',
    'SmartExamen'
    
  ];

  ngOnChanges() {
    if (this.isEditMode && this.creneau) {
      this.date = this.creneau.date;
      this.heureDebut = this.creneau.heureDebut;
      this.heureFin = this.creneau.heureFin;
      this.selectedStatus = this.creneau.statut === 'ANNULE' ? 'canceled' : 'not_yet';
      
      if (this.creneau.reservation) {
        this.typeImpression = this.creneau.reservation.typeImpression;
        this.specialite = this.creneau.reservation.specialite;
        this.niveau = this.creneau.reservation.niveau;
        this.matiere = this.creneau.reservation.matiere;
        this.nbrImpression = this.creneau.reservation.nbrPage;
      }
    }
  }

  constructor(private creneauxService: CreneauxService, private reservationService: ReservationService) {}

  onClose() {
    this.closeModal.emit();
  }

  onSave() {
    const creneau: Creneaux = {
      date: this.date,
      heureDebut: this.heureDebut,
      heureFin: this.heureFin,
      statut: this.selectedStatus === 'not_yet' ? 'RESERVE' : 'ANNULE',
      reservation: {
        ...(this.isEditMode && this.creneau?.reservation?.id && { 
          id: this.creneau.reservation.id 
        }),
        typeImpression: this.typeImpression,
        niveau: this.niveau,
        specialite: this.specialite,
        matiere: this.matiere,
        nbrPage: this.nbrImpression
      }
    };
  
    this.eventSaved.emit(creneau);
  }
}

 