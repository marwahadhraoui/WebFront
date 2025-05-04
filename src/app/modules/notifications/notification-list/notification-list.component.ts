
import { Component, OnInit } from '@angular/core';
import { ExamenService } from '../../../services/examen.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-notification-list',
  imports: [CommonModule],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.css'
})
export class NotificationListComponent {

  alertes: any[] = [];
  loading: boolean = true;
  errorMessage: string | null = null;

  constructor(private examenService: ExamenService) { }

  ngOnInit(): void {
    this.loadAlertesExamens();
  }

  loadAlertesExamens(): void {
    this.loading = true;
    this.examenService.getAlertesExamens().subscribe({
      next: (data) => {
        this.alertes = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la récupération des alertes.';
        console.error('Erreur de récupération des alertes:', error);
        this.loading = false;
      }
    });
  }
}