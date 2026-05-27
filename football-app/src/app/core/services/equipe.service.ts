import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EquipeDTO } from '../models/equipe.model';
import { CoachDTO } from '../models/coach.model';


@Injectable({
  providedIn: 'root',
})
export class EquipeService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8080/api';

  getByStade(stadeId: number): Observable<EquipeDTO> {
    return this.http.get<EquipeDTO>(`${this.base}/equipes/stade/${stadeId}`);
  }

  getCoachs(equipeId: number): Observable<CoachDTO[]> {
    return this.http.get<CoachDTO[]>(`${this.base}/coachs/equipe/${equipeId}`);
  }
}

