export interface JoueurDTO {
  id: number;
  nom: string;
  prenom: string;
  numero: number;
  photo?: string;
  estRemplacant: boolean;
  equipeId: number;
}