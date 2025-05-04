import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import {
  CalendarOptions,
  EventClickArg,
  EventInput,
} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { EventModalComponent } from '../../../components/event-modal/event-modal.component';
import { FormsModule } from '@angular/forms';
import { EventContextMenuComponent } from '../../../components/event-context-menu/event-context-menu.component';
import { CreneauxService } from '../../../services/creneaux.service';
import { Creneaux } from '../../../models/creneaux.model';
import { User } from '../../../models/user.model';
import { ReservationService } from '../../../services/reservation.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-schedule-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule,
    EventModalComponent,
    FormsModule,
    EventContextMenuComponent,
    
  ],
  templateUrl: './schedule-calendar.component.html',
  styleUrls: ['./schedule-calendar.component.css'],
})
export class ScheduleCalendarComponent implements OnInit {
  @ViewChild(EventModalComponent) eventModal!: EventModalComponent;

  protected calendarOptions: CalendarOptions = {};
  protected isBrowser: boolean = false;
  creneaux: Creneaux[] = [];

  showModal = false;
  selectedDate: string = '';
  selectedHeure: string = '';
  selectedEndHeure: string = '';
  showContextMenu = false;
  contextMenuPosition = { top: '0px', left: '0px' };
  selectedEventId = '';
  isEditMode = false;
  selectedCreneau: Creneaux | null = null;


  constructor(@Inject(PLATFORM_ID) private platformId: Object, private creneauxService: CreneauxService, private reservationService: ReservationService,private authService:AuthService) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadCreneaux();
      this.initializeCalendar();
    }
  }

  private loadCreneaux(): void {
    this.creneauxService.getAllCreneaux().subscribe({
      next: (creneaux) => {
        this.creneaux = creneaux;
        this.updateCalendarEvents();
      },
      error: (err) => console.error('Error loading creneaux', err)
    });
  }

  private updateCalendarEvents(): void {
    const events: EventInput[] = this.creneaux.map(creneau => ({
      id: creneau.id?.toString(),
      title: this.generateEventTitle(creneau), // Utilisation d'une méthode pour générer le titre
      start: `${creneau.date}T${creneau.heureDebut}`,
      end: `${creneau.date}T${creneau.heureFin}`,
      backgroundColor: this.getEventColor(creneau.statut),
      extendedProps: {
        statut: creneau.statut,
        reservation: creneau.reservation,
        secretaire: creneau.secretaire,
        examen: creneau.reservation?.examen,
      examenInfo: creneau.reservation?.examen ? 
        `Examen: ${creneau.reservation.examen.matiere} (${creneau.reservation.examen.dateExamen})` : 
        'Aucun examen associé',
        // Ajout des informations supplémentaires
        details: this.generateEventDetails(creneau)
      }
    }));
  
    this.calendarOptions.events = events;
  }

  private getEventColor(statut: string): string {
    switch (statut) {
      case 'RESERVE': return '#3498db'; // Blue
      case 'TERMINE': return '#2ecc71'; // Green
      case 'ANNULE': return '#e74c3c'; // Red
      default: return '#9b59b6'; // Purple
    }
  }
  private initializeCalendar(): void {
    this.calendarOptions = {
      initialView: 'timeGridWeek',
      eventDidMount: (info) => {
        info.el.setAttribute('title', info.event.extendedProps['details']);
      },
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      },
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      weekends: true,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      nowIndicator: true,
      allDaySlot: false,
      slotMinTime: '08:00:00',
      slotMaxTime: '20:00:00',
      eventClick: this.handleEventClick.bind(this),
      select: this.handleDateClick.bind(this),
      events: (info, successCallback, failureCallback) => {
        this.loadCreneaux();
      }
    };
  }

  private handleDateClick(arg: any): void {
    this.showModal = true;
    this.selectedDate = arg.startStr.split('T')[0]; // Extract date from datetime string
    this.selectedHeure = arg.startStr.split('T')[1].substring(0, 5); // Extract time
    this.selectedEndHeure = arg.endStr.split('T')[1].substring(0, 5);
  }
  onModalClose() {
    this.showModal = false;
  }

  handleEventClick(clickInfo: EventClickArg) {
    clickInfo.jsEvent.preventDefault();
    clickInfo.jsEvent.stopPropagation(); // Stop event bubbling
    // Trouver le créneau correspondant
    const creneauId = clickInfo.event.id;
    this.creneauxService.getCreneau(+creneauId).subscribe({
      next: (creneau) => {
        this.selectedCreneau = creneau;
        this.selectedEventId = creneauId;
        this.showContextMenu = true;
        this.contextMenuPosition = {
          top: `${clickInfo.jsEvent.clientY + 10}px`,
          left: `${clickInfo.jsEvent.clientX + 10}px`
        };
      },
      error: (err) => console.error('Erreur de chargement', err)
    });

    // Close when clicking elsewhere (with proper cleanup)
    setTimeout(() => {
      const clickHandler = (event: MouseEvent) => {
        if (!clickInfo.el.contains(event.target as Node)) {
          this.showContextMenu = false;
          document.removeEventListener('click', clickHandler);
        }
      };
      document.addEventListener('click', clickHandler);
    });
  }

  onEditEvent() {
    if (this.selectedCreneau) {
      this.isEditMode = true;
      this.showModal = true;
      this.showContextMenu = false;
    }
  }

  onEventSaved(creneauData: Creneaux) { 
      // Récupérer l'utilisateur connecté
  const currentUser = this.authService.getUser();
  
  if (!currentUser) {
    console.error('Aucun utilisateur connecté');
    return;
  }

  // Associer l'utilisateur au créneau
  creneauData.secretaire = {
    id: currentUser.id,
    nom: currentUser.nom,
    prenom: currentUser.prenom,
    email: currentUser.email,
    role: currentUser.role
  } as User;
    if (this.isEditMode && this.selectedEventId) {
      this.creneauxService.updateCreneau(+this.selectedEventId, creneauData)
        .subscribe({
          next: (updatedCreneau) => {
            this.loadCreneaux();
            this.showModal = false;
            this.isEditMode = false;
          },
          error: (err) => {
            console.error('Update failed:', err);
            this.showModal = false;
          }
        });
    } else { 
      creneauData.secretaire==this.authService.getUser();
      this.creneauxService.createCreneau(creneauData)
        .subscribe({
          next: (createdCreneau) => {
            // Update calendar display
            const newEvent: EventInput = {
              id: createdCreneau.id?.toString(),
              title: `${createdCreneau.reservation?.typeImpression} - ${createdCreneau.reservation?.niveau}`,
              start: `${createdCreneau.date}T${createdCreneau.heureDebut}`,
              end: `${createdCreneau.date}T${createdCreneau.heureFin}`,
              backgroundColor: this.getEventColor(createdCreneau.statut),
              extendedProps: {
                statut: createdCreneau.statut,
                reservation: createdCreneau.reservation,
                secretaire: createdCreneau.secretaire
              }
            };

            if (!this.calendarOptions.events) {
              this.calendarOptions.events = [];
            }

            this.showModal = false;
            this.loadCreneaux();
          },
          error: (err) => {
            console.error('Creation failed:', err);
            this.showModal = false;
          }
        });
    }

  } onDeleteEvent() {
    if (this.selectedEventId) {
      this.creneauxService.deleteCreneau(+this.selectedEventId).subscribe({
        next: () => {
          // Suppression locale de l'événement
          this.calendarOptions.events = (this.calendarOptions.events as EventInput[])
            .filter(event => event.id !== this.selectedEventId);

          // Fermer le menu contextuel
          this.showContextMenu = false;

          // Recharger les données si nécessaire
          this.loadCreneaux();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression', err);
          this.showContextMenu = false;
        }
      });
    }
  } 

  // Nouvelle méthode pour générer le titre de l'événement
private generateEventTitle(creneau: Creneaux): string {
  let title = '';
  
  if (creneau.reservation) {
    title += `${creneau.reservation.typeImpression || ''}`;
    title += creneau.reservation.niveau ? ` - ${creneau.reservation.niveau}` : '';
    title += creneau.reservation.matiere ? ` - ${creneau.reservation.matiere}` : '';
  }
  
  if (creneau.secretaire) {
    title += ` (${creneau.secretaire.prenom} ${creneau.secretaire.nom})`;
  }
  
  return title || 'Nouveau créneau';
}

// Nouvelle méthode pour générer les détails de l'événement
private generateEventDetails(creneau: Creneaux): string {
  let details = '';
  
  if (creneau.reservation) {
    details += `Spécialité: ${creneau.reservation.specialite || 'Non spécifié'}\n`;
    details += `Niveau: ${creneau.reservation.niveau || 'Non spécifié'}\n`;
    details += `Matière: ${creneau.reservation.matiere || 'Non spécifié'}\n`;
  }
  
  if (creneau.secretaire) {
    details += `Géré par: ${creneau.secretaire.prenom} ${creneau.secretaire.nom}`;
  }
  
  return details;
}
}
