export interface StadeDTO {
  id: number;
  nom: string;
  ville: string;
  capacite: number;
  latitude: number;
  longitude: number;
}

export interface StadeDetailDTO extends StadeDTO {
  adresse?: string;
  anneeConstruction?: number;
}

export interface StadeMarkerDTO {
  id: number;
  nom: string;
  latitude: number;
  longitude: number;
}