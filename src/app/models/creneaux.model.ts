import { Reservation } from "./reservation.model";
import { User } from "./user.model";

export interface Creneaux {
    id?: number;
    date: string;
    heureDebut: string;
    heureFin: string;
    statut: string;
    secretaire?: User;
    reservation?: Reservation
  }
  