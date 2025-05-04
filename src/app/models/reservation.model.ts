import { Creneaux } from "./creneaux.model";
import { Examen } from "./examen.model";
export interface Reservation {
    id?: number;
    typeImpression: string;
    niveau: string;
    specialite: string;
    matiere: string;
    nbrPage: number;
    creneaux?: Creneaux;
    examen?: Examen;
  }