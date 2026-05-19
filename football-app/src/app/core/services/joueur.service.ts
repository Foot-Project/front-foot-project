import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JoueurDTO } from '../models/joueur.model';

@Injectable({ providedIn: 'root' })
export class JoueurService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8080/api';

  getByEquipe(equipeId: number): Observable<JoueurDTO[]> {
    return this.http.get<JoueurDTO[]>(`${this.base}/joueurs/equipe/${equipeId}`);
  }
}