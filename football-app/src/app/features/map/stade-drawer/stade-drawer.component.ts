import { Component, Input, Output, EventEmitter, inject } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { DrawerModule } from 'primeng/drawer';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { StadeService } from '../../../core/services/stade.service';
import { EquipeService } from '../../../core/services/equipe.service';
import { JoueurService } from '../../../core/services/joueur.service';
import { StadeDetailDTO } from '../../../core/models/stade.model';
import { EquipeDTO } from '../../../core/models/equipe.model';
import { CoachDTO } from '../../../core/models/coach.model';
import { JoueurDTO } from '../../../core/models/joueur.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-stade-drawer',
  standalone: true,
  imports: [
    CommonModule,
    DrawerModule,
    TabsModule,
    TagModule,
    SkeletonModule,
    AvatarModule,
    BadgeModule,
  ],
  templateUrl: './stade-drawer.component.html',
  styleUrl: './stade-drawer.component.scss',
})
export class StadeDrawerComponent { 

  @Input() stadeId = 0;
  @Output() closeDrawer = new EventEmitter<void>();

  private _visible = false;

  @Input()
  set visible(value: boolean) {
    console.log('👁️ visible setter:', value, '| stadeId:', this.stadeId);
    this._visible = value;
    if (value && this.stadeId) {
      this.loadData();
    }
  }

  get visible(): boolean {
    return this._visible;
  }

  private stadeService = inject(StadeService);
  private equipeService = inject(EquipeService);
  private joueurService = inject(JoueurService);

  stade: StadeDetailDTO | null = null;
  equipe: EquipeDTO | null = null;
  coach: CoachDTO | null = null;
  joueurs: JoueurDTO[] = [];
  loading = false;

  get titulaires(): JoueurDTO[] {
    return this.joueurs.filter(j => !j.estRemplacant);
  }

  get remplacants(): JoueurDTO[] {
    return this.joueurs.filter(j => j.estRemplacant);
  }

  private loadData(): void {
    this.loading = true;
    this.stade = null;
    this.equipe = null;
    this.coach = null;
    this.joueurs = [];

    this.stadeService.getDetail(this.stadeId).subscribe({
      next: (stade) => {
        this.stade = stade;
        this.equipeService.getByStade(this.stadeId).subscribe({
          next: (equipe) => {
            this.equipe = equipe;
            forkJoin({
              joueurs: this.joueurService.getByEquipe(equipe.id),
              coach: this.equipeService.getCoach(equipe.id),
            }).subscribe({
              next: ({ joueurs, coach }) => {
                this.joueurs = joueurs;
                this.coach = coach;
                this.loading = false;
              },
              error: () => (this.loading = false),
            });
          },
          error: () => (this.loading = false),
        });
      },
      error: () => (this.loading = false),
    });
  }

  close(): void {
    this.closeDrawer.emit();
  }
}