

// examen.model.ts

export interface Enseignant {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    // autres propriétés si nécessaire
  }
  
  export interface Examen {
    id?: number;  // Optionnel car peut être undefined avant création
    matiere: string;
    dateExamen: Date | string;  // Date en TypeScript ou string pour le format ISO
    niveau: string;
    specialite: string;
    enseignant: Enseignant;
  }
  
  // Classe facultative pour les méthodes utilitaires
  export class ExamenModel implements Examen {
    constructor(
      public matiere: string,
      public dateExamen: Date,
      public niveau: string,
      public specialite: string,
      public enseignant: Enseignant,
      public id?: number
    ) {}
  
    // Méthode pour créer un Examen à partir d'un objet JSON
    static fromJson(json: any): Examen {
      return {
        id: json.id,
        matiere: json.matiere,
        dateExamen: new Date(json.dateExamen),  // Conversion de la date
        niveau: json.niveau,
        specialite: json.specialite,
        enseignant: {
          id: json.enseignant?.id,
          nom: json.enseignant?.nom,
          prenom: json.enseignant?.prenom,
          email: json.enseignant?.email
        }
      };
    }
  
    // Méthode pour formater la date d'examen
    getFormattedDate(): string {
      return new Date(this.dateExamen).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  
    // Méthode pour obtenir le nom complet de l'enseignant
    getEnseignantName(): string {
      return `${this.enseignant.prenom} ${this.enseignant.nom}`;
    }
  }