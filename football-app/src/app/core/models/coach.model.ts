export interface CoachDTO {
  id: number;
  nom: string;
  prenom: string;
  photo?: string;
  role: string;
  equipeId: number;
}