import { Creneaux } from "./creneaux.model";

export interface Reservation {
    id?: number;
    typeImpression: string;
    niveau: string;
    specialite: string;
    matiere: string;
    nbrPage: number;
    creneaux?: Creneaux;
  }