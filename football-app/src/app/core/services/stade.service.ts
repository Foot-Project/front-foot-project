import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StadeDetailDTO, StadeMarkerDTO } from '../models/stade.model';

@Injectable({
  providedIn: 'root',
})
export class StadeService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8080/api';

  getMarkers(): Observable<StadeMarkerDTO[]> {
    return this.http.get<StadeMarkerDTO[]>(`${this.base}/stades/markers`);
  }

  getDetail(id: number): Observable<StadeDetailDTO> {
    return this.http.get<StadeDetailDTO>(`${this.base}/stades/${id}`);
  }
}
