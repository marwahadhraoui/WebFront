import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  imports: [CommonModule,FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  theme: string = 'light'; // Thème de l'application (clair ou sombre)
  langue: string = 'fr'; // Langue sélectionnée (français par défaut)
  horairesOuverture: string = '08:00 - 18:00'; // Horaires par défaut
  limiteReservations: number = 5; // Nombre max de réservations par jour

  constructor() {}

  ngOnInit(): void {
    this.chargerParametres();
  }

  // Charger les paramètres enregistrés dans localStorage
  chargerParametres() {
    const params = localStorage.getItem('parametres');
    if (params) {
      const data = JSON.parse(params);
      this.theme = data.theme;
      this.langue = data.langue;
      this.horairesOuverture = data.horairesOuverture;
      this.limiteReservations = data.limiteReservations;
    }
  }

  // Sauvegarder les paramètres dans localStorage
  sauvegarderParametres() {
    const parametres = {
      theme: this.theme,
      langue: this.langue,
      horairesOuverture: this.horairesOuverture,
      limiteReservations: this.limiteReservations
    };
    localStorage.setItem('parametres', JSON.stringify(parametres));
    alert('Paramètres sauvegardés avec succès !');
  }
}