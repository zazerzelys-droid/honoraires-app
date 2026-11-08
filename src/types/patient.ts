export interface Acte {
  id: string;
  nom: string;
  montant: number;
}

export interface Passage {
  id: string;
  date: string;
  actes: Acte[];
}

export interface Patient {
  id: string;
  nom: string;
  chambre: string;
  etage: string;
  clinique: string;
  passages: Passage[];
  statut: "en_attente" | "paye";
  archive: boolean;
  createdAt: string;
}

export const ACTES_STANDARDS: { nom: string; montant: number }[] = [
  { nom: "Consultation au lit", montant: 400 },
  { nom: "Fibroscopie bronchique", montant: 2000 },
  { nom: "Ponction pleurale", montant: 800 },
  { nom: "Ponction biopsie pleurale", montant: 1500 },
  { nom: "Drainage pneumothorax", montant: 2000 },
];

export const CLINIQUES_DEFAUT = [
  "Hôpital Privé de Salé AKDITAL",
  "Clinique AKDITAL AGDAL",
  "Polyclinique AGDAL",
  "Polyclinique de RABAT",
];
